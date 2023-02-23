/* global google */
import {
	GoogleMap,
	InfoWindow,
	MarkerF,
	useLoadScript,
} from '@react-google-maps/api';
import { useState } from 'react';
import './App.css';

const App = () => {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
	});
	const [mapRef, setMapRef] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [infoWindowData, setInfoWindowData] = useState();
	const markers = [
		{ address: 'Address1', lat: 17.99555, lng: -94.55532 },
		{ address: 'Address2', lat: 17.99155, lng: -94.54132 },
		{ address: 'Address3', lat: 17.99445, lng: -94.55112 },
	];

	const onMapLoad = (map) => {
		setMapRef(map);
		const bounds = new google.maps.LatLngBounds();
		markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
		map.fitBounds(bounds);
	};

	const handleMarkerClick = (id, lat, lng, address) => {
		mapRef?.panTo({ lat, lng });
		setInfoWindowData({ id, address });
		setIsOpen(true);
	};

	return (
		<div className='App'>
			{!isLoaded ? (
				<h1>Loading...</h1>
			) : (
				<GoogleMap
					mapContainerClassName='map-container'
					onLoad={onMapLoad}
					onClick={() => setIsOpen(false)}
				>
					{markers.map(({ address, lat, lng }, ind) => (
						<MarkerF
							key={ind}
							position={{ lat, lng }}
							onClick={() => {
								handleMarkerClick(ind, lat, lng, address);
							}}
						>
							{isOpen && infoWindowData?.id === ind && (
								<InfoWindow
									onCloseClick={() => {
										setIsOpen(false);
									}}
								>
									<h3 className='p-5'>{infoWindowData.address}</h3>
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
