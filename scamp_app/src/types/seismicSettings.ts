export type DataSetType = 'lunar' | 'mars' | 'custom';

export type SeismicSettings = {
  dataSet: DataSetType,
  event: string,
}
