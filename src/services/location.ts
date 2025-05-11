export interface Location {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const searchLocations = async (query: string): Promise<Location[]> => {
  // This is a mock implementation that will be overridden in tests
  return [];
}; 