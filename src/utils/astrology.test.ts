import {
  calculateBirthChart,
  calculatePlanetaryAspects,
  calculateHouses,
  calculateCompatibility,
  analyzeCareer,
  analyzeFinance,
  BirthDetails
} from './astrology';

const user1: BirthDetails = {
  name: 'Alice',
  birthDate: '1990-05-15',
  birthPlace: 'Delhi, India'
};

const user2: BirthDetails = {
  name: 'Bob',
  birthDate: '1992-08-20',
  birthPlace: 'Mumbai, India'
};

console.log('--- Birth Chart ---');
console.log(calculateBirthChart(user1));

console.log('--- Planetary Aspects ---');
console.log(calculatePlanetaryAspects({ Sun: 'Taurus', Moon: 'Cancer' }));

console.log('--- Houses ---');
console.log(calculateHouses(user1));

console.log('--- Compatibility ---');
console.log(calculateCompatibility(user1, user2));

console.log('--- Career Analysis ---');
console.log(analyzeCareer(user1));

console.log('--- Finance Analysis ---');
console.log(analyzeFinance(user1)); 