import {useState} from "react";
import {
  Box,
  BoxProps,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  useRadioGroup,
  VStack,
  Image,
  Tooltip,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

import {useSeismicSettings} from "../../context/seismicSettings.tsx";
import {SeismicSettings} from "../../types/seismicSettings.ts";
import RadioCard from "../RadioCard";

import logo from '../../assets/logo_w.svg'

const PanelMain: React.FC<BoxProps> = (props) => {
  const [value, setValue] = useState('1');
  const {settings, setSettings} = useSeismicSettings();

  const {getRootProps, getRadioProps} = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: (value: SeismicSettings['dataSet']) => {
      setSettings({
        ...settings,
        dataSet: value
      });
    },
  });

  const {getRootProps: getRootPropsSource, getRadioProps: getRadioPropsSource} = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: (value: SeismicSettings['dataSource']) => {
      setSettings({
        ...settings,
        dataSource: value
      });
    },
  });

  const eventCatalogue = [
    'xa.s12.00.mhz.1970-01-19HR00_evid00002',
    'xa.s12.00.mhz.1970-03-25HR00_evid00003',
    'xa.s12.00.mhz.1970-03-26HR00_evid00004',
    'xa.s12.00.mhz.1970-04-25HR00_evid00006',
    'xa.s12.00.mhz.1970-04-26HR00_evid00007',
    'xa.s12.00.mhz.1970-06-15HR00_evid00008',
    'xa.s12.00.mhz.1970-06-26HR00_evid00009',
    'xa.s12.00.mhz.1970-07-20HR00_evid00010',
    'xa.s12.00.mhz.1970-07-20HR00_evid00011',
    'xa.s12.00.mhz.1970-09-26HR00_evid00013',
    'xa.s12.00.mhz.1970-10-24HR00_evid00014',
    'xa.s12.00.mhz.1970-11-12HR00_evid00015',
    'xa.s12.00.mhz.1970-12-11HR00_evid00017',
    'xa.s12.00.mhz.1970-12-27HR00_evid00019',
    'xa.s12.00.mhz.1970-12-31HR00_evid00021',
    'xa.s12.00.mhz.1971-01-15HR00_evid00022',
    'xa.s12.00.mhz.1971-01-28HR00_evid00023',
    'xa.s12.00.mhz.1971-01-29HR00_evid00024',
    'xa.s12.00.mhz.1971-02-09HR00_evid00026',
    'xa.s12.00.mhz.1971-03-25HR00_evid00028',
    'xa.s12.00.mhz.1971-04-13HR00_evid00029',
    'xa.s12.00.mhz.1971-04-17HR00_evid00030',
    'xa.s12.00.mhz.1971-05-12HR00_evid00031',
    'xa.s12.00.mhz.1971-05-12HR00_evid00032',
    'xa.s12.00.mhz.1971-05-13HR00_evid00033',
    'xa.s12.00.mhz.1971-05-23HR00_evid00034',
    'xa.s12.00.mhz.1971-06-12HR00_evid00035',
    'xa.s12.00.mhz.1971-09-25HR00_evid00042',
    'xa.s12.00.mhz.1971-10-18HR00_evid00043',
    'xa.s12.00.mhz.1971-10-20HR00_evid00044',
    'xa.s12.00.mhz.1971-10-31HR00_evid00045',
    'xa.s12.00.mhz.1971-11-14HR00_evid00046',
    'xa.s12.00.mhz.1972-01-04HR00_evid00049',
    'xa.s12.00.mhz.1972-03-12HR00_evid00052',
    'xa.s12.00.mhz.1972-05-11HR00_evid00055',
    'xa.s12.00.mhz.1972-06-16HR00_evid00060',
    'xa.s12.00.mhz.1972-07-17HR00_evid00067',
    'xa.s12.00.mhz.1972-07-17HR00_evid00068',
    'xa.s12.00.mhz.1972-07-28HR00_evid00070',
    'xa.s12.00.mhz.1972-07-31HR00_evid00071',
    'xa.s12.00.mhz.1972-12-02HR00_evid00083',
    'xa.s12.00.mhz.1972-12-03HR00_evid00084',
    'xa.s12.00.mhz.1973-01-18HR00_evid00088',
    'xa.s12.00.mhz.1973-01-31HR00_evid00091',
    'xa.s12.00.mhz.1973-03-01HR00_evid00093',
    'xa.s12.00.mhz.1973-03-13HR00_evid00094',
    'xa.s12.00.mhz.1973-03-24HR00_evid00097',
    'xa.s12.00.mhz.1973-05-14HR00_evid00104',
    'xa.s12.00.mhz.1973-06-05HR00_evid00107',
    'xa.s12.00.mhz.1973-06-05HR00_evid00108',
    'xa.s12.00.mhz.1973-06-18HR00_evid00109',
    'xa.s12.00.mhz.1973-06-27HR00_evid00112',
    'xa.s12.00.mhz.1973-07-03HR00_evid00113',
    'xa.s12.00.mhz.1973-07-04HR00_evid00114',
    'xa.s12.00.mhz.1973-07-20HR00_evid00117',
    'xa.s12.00.mhz.1973-07-28HR00_evid00120',
    'xa.s12.00.mhz.1973-07-29HR00_evid00121',
    'xa.s12.00.mhz.1973-08-21HR00_evid00127',
    'xa.s12.00.mhz.1974-01-10HR00_evid00136',
    'xa.s12.00.mhz.1974-02-07HR00_evid00137',
    'xa.s12.00.mhz.1974-02-12HR00_evid00138',
    'xa.s12.00.mhz.1974-03-25HR00_evid00140',
    'xa.s12.00.mhz.1974-04-08HR00_evid00141',
    'xa.s12.00.mhz.1974-04-19HR00_evid00142',
    'xa.s12.00.mhz.1974-04-26HR00_evid00144',
    'xa.s12.00.mhz.1974-04-27HR00_evid00145',
    'xa.s12.00.mhz.1974-06-25HR00_evid00149',
    'xa.s12.00.mhz.1974-07-06HR00_evid00150',
    'xa.s12.00.mhz.1974-07-06HR00_evid00151',
    'xa.s12.00.mhz.1974-07-11HR00_evid00152',
    'xa.s12.00.mhz.1974-07-17HR00_evid00153',
    'xa.s12.00.mhz.1974-10-14HR00_evid00156',
    'xa.s12.00.mhz.1975-04-12HR00_evid00191',
    'xa.s12.00.mhz.1975-05-04HR00_evid00192',
    'xa.s12.00.mhz.1975-06-24HR00_evid00196',
    'xa.s12.00.mhz.1975-06-26HR00_evid00198',
  ];

  return <Box
    {...props}
    padding="2"
    width="400px"
    maxHeight="100vh"
    overflowY="scroll"
  >
    <VStack
      divider={<StackDivider borderColor='gray.600'/>}
      spacing={4}
      align='stretch'
    >
      <Tooltip
        label="Seismic Catalogue Analysis and Mapping Platform"
        hasArrow
      >
        <Box
          display="flex"
          alignItems="center"
          gap="4"
          marginBottom={-2}
        >
          <Image src={logo} alt="SCAMP" boxSize="70px" display="inline-block"/>
          <Heading as="h1" size="lg">S.C.A.M.P</Heading>
        </Box>
      </Tooltip>
      <HStack {...getRootProps()}>
        <RadioCard key="lunar" {...getRadioProps({value: 'lunar'})}>Moon</RadioCard>
        <RadioCard key="mars" {...getRadioProps({value: 'mars'})}>Mars</RadioCard>
        <RadioCard key="pi" {...getRadioProps({value: 'pi'})}>RPi</RadioCard>
        <RadioCard key="custom" {...getRadioProps({value: 'custom'})}>Custom</RadioCard>
      </HStack>
      {settings.dataSet === 'custom' ? (
        <>
          <FormLabel>Custom dataset:</FormLabel>
          <HStack>
            <Input disabled placeholder="URL of CSV catalog data (like .../apollo12_catalog_GradeA_final.csv)" size="sm"/>
            <Button disabled size="sm">Load</Button>
          </HStack>
        </>
      ) : (
        <>
          <FormLabel>Data source:</FormLabel>
          <HStack {...getRootPropsSource()}>
            <RadioCard sizeY={1} key="all" {...getRadioPropsSource({value: 'all'})}>All</RadioCard>
            <RadioCard sizeY={1} key="nasa" {...getRadioPropsSource({value: 'nasa'})}>NASA</RadioCard>
            <RadioCard sizeY={1} key="resonate" {...getRadioPropsSource({value: 'resonate'})}>RESONATE</RadioCard>
          </HStack>
        </>
      )}
      <RadioGroup onChange={setValue} value={value}
        size="sm" overflow="hidden" maxHeight="100vh"
      >
        <Stack>
          {eventCatalogue.map((event) => (
            <Radio
              key={event} value={event}
              onChange={() => setSettings({
                ...settings,
                event
              })}
            >
              {event}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </VStack>
  </Box>
};

export default PanelMain;
