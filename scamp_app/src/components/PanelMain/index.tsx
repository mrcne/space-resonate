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
  VStack
} from "@chakra-ui/react";
import RadioCard from "../RadioCard";

const PanelMain: React.FC<BoxProps> = (props) => {
  const [value, setValue] = useState('1');

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: console.log,
  });

  return <Box
    {...props}
    padding="2"
  >
    <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'
    >
      <Heading as="h1" size="lg">S.C.A.M.P</Heading>
      <HStack {...getRootProps()}>
        <RadioCard key="moon" {...getRadioProps({ value: 'moon' })}>Moon</RadioCard>
        <RadioCard key="mars" {...getRadioProps({ value: 'mars' })}>Moon</RadioCard>
      </HStack>
      <RadioGroup onChange={setValue} value={value}>
        <Stack>
          <Radio value='1'>2019-04-11 08:33:08</Radio>
          <Radio value='2'>2019-05-20 08:33:08</Radio>
          <Radio value='3'>2019-06-22 08:33:08</Radio>
        </Stack>
      </RadioGroup>
    </VStack>
  </Box>
};

export default PanelMain;
