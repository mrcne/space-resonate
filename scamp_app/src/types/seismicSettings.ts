export type DataSetType = 'lunar' | 'mars' | 'pi' | 'custom';
export type DataSetSource = 'all' | 'nasa' | 'resonate';

export type SeismicSettings = {
  dataSet: DataSetType,
  dataSource: DataSetSource,
  event: string,
}
