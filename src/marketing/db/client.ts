import { db } from './index';

type DataSource = 'doctoralia'; // Expandable for other sources in the future

/**
 * Fetches historical data from the database based on a specific source.
 * Currently tailored for 'doctoralia' historical views.
 * @param source The data source to query.
 * @returns A promise that resolves to an array of historical data points.
 */
export const getRadarDataBySource = async (source: DataSource): Promise<{ mes: string; views: number }[]> => {
  if (source === 'doctoralia') {
    const setting = await db.settings.get('historical_data');
    // Ensure we return an array, even if data is missing or malformed.
    if (setting && Array.isArray(setting.value)) {
      return setting.value;
    }
  }
  // Return an empty array as a fallback for unknown sources or missing data.
  return [];
};
