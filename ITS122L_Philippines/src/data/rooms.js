import imgTower from '../assets/room-tower.jpg';
import imgSeaview from '../assets/room-seaview.jpg';
import imgSeaviewPremier from '../assets/room-seaview-premier.jpg';
import imgVilla3 from '../assets/room-villa3.jpg';
import imgVilla2 from '../assets/room-villa2.jpg';
import imgFunction from '../assets/room-function.jpg';

export const ROOMS = [
  {
    value: 'Tower Room',
    price: 2500,
    icon: '🏢',
    image: imgTower,
    capacity: 2,
    description: '1 queen size bed, cable TV, aircon, hot & cold water shower, personal refrigerator',
    amenities: ['Queen Bed', 'Cable TV', 'Aircon', 'Hot & Cold Shower', 'Refrigerator'],
  },
  {
    value: 'Sea View',
    price: 2500,
    icon: '🌊',
    image: imgSeaview,
    capacity: 2,
    description: '1 queen size bed, cable TV, aircon, hot & cold water shower, personal refrigerator',
    amenities: ['Queen Bed', 'Cable TV', 'Aircon', 'Hot & Cold Shower', 'Refrigerator', 'Sea View'],
  },
  {
    value: 'Sea View Premier Room',
    price: 3500,
    icon: '🌅',
    image: imgSeaviewPremier,
    capacity: 2,
    description: '1 queen size bed, cable TV, airconditioned, hot & cold water shower, personal refrigerator',
    amenities: ['Queen Bed', 'Cable TV', 'Aircon', 'Hot & Cold Shower', 'Refrigerator', 'Sea View'],
  },
  {
    value: 'Private Villa III',
    price: 10000,
    icon: '🏡',
    image: imgVilla3,
    capacity: 8,
    description: '2 airconditioned bedrooms, 4 queen size beds, hot & cold water showers, refrigerator, living & dining area, view deck',
    amenities: ['2 Bedrooms', '4 Queen Beds', 'Aircon', 'Hot & Cold Shower', 'Refrigerator', 'Living Area', 'View Deck'],
  },
  {
    value: 'Private Villa II',
    price: 22000,
    icon: '🏰',
    image: imgVilla2,
    capacity: 12,
    description: '3 airconditioned bedrooms, hot & cold water showers, refrigerator, lanai, and private infinity pool',
    amenities: ['3 Bedrooms', 'Aircon', 'Hot & Cold Shower', 'Refrigerator', 'Lanai', 'Private Infinity Pool'],
  },
  {
    value: 'Function Room',
    price: 15000,
    icon: '🎉',
    image: imgFunction,
    capacity: 50,
    description: 'Per day with 4 hours aircon — perfect for events, birthdays, team-building, and celebrations',
    amenities: ['4 Hours Aircon', 'Event Setup', 'Per Day Rate'],
  },
];