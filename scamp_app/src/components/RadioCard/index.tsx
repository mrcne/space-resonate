import {Box, useRadio, UseRadioProps} from "@chakra-ui/react";

type Props = UseRadioProps & {
  children: React.ReactNode,
  sizeX?: string | number,
  sizeY?: string | number,
};

function RadioCard({
  sizeX = 3,
  sizeY = 5,
  ...props
}: Props) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={sizeX}
        py={sizeY}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard;
