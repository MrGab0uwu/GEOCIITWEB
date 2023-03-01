// global google
import {
	GoogleMap,
	InfoWindow,
	MarkerF,
	useLoadScript,
} from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabase/client';

const App = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
	});
	const [mapRef, setMapRef] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [infoWindowData, setInfoWindowData] = useState();

	const [markers, setMarkers] = useState([]);

	const [counter, setCounter] = useState(4);
	useEffect(() => {
		const fetchApi = async () => {
			const { data } = await supabase
				.from('gps-data')
				.select()
				.eq('id', counter);
			setCounter(counter + 1);
			console.log(counter);
			console.log(data);
			const newData = data.map(({ lat, lng, type }) => {
				const latInt = parseFloat(lat);
				const lngInt = parseFloat(lng);

				return {
					lat: latInt,
					lng: lngInt,
					type,
				};
			});
			console.log(newData);
			setMarkers(newData);
		};

		const interval = setInterval(() => {
			fetchApi();
		}, 3000);

		return () => clearInterval(interval);
	}, [markers, counter]);

	const onMapLoad = (map) => {
		setMapRef(map);
		// const bounds = new google.maps.LatLngBounds();
		// markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
		// map.fitBounds(bounds);
	};

	const handleMarkerClick = (id, lat, lng, type) => {
		mapRef?.panTo({ lat, lng });
		setInfoWindowData({ id, type });
		setIsOpen(true);
	};

	return (
		<div className='App'>
			{!isLoaded ? (
				<h1>Loading...</h1>
			) : (
				<GoogleMap
					mapContainerClassName='map-container'
					center={{ lat: 17.996528, lng: -94.557722 }}
					onLoad={onMapLoad}
					onClick={() => setIsOpen(false)}
					zoom={1}
				>
					{markers.map(({ type, lat, lng }, ind) => (
						<MarkerF
							key={ind}
							position={{ lat, lng }}
							onClick={() => {
								handleMarkerClick(ind, lat, lng, type);
							}}
						>
							{isOpen && infoWindowData?.id === ind && (
								<InfoWindow
									onCloseClick={() => {
										setIsOpen(false);
									}}
								>
									<h3 className='p-5'>{infoWindowData.type}</h3>
								</InfoWindow>
							)}
						</MarkerF>
					))}
				</GoogleMap>
			)}
		</div>
	);
};

export default App;
