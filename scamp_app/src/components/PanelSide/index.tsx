import {
  Box,
  BoxProps,
  Button, Flex,
  Heading,
  Image,
  Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import {useCallback} from "react";

import {useSeismicSettings} from "../../context/seismicSettings.tsx";
import {SeismicSettings} from "../../types/seismicSettings.ts";

const PanelSide: React.FC<BoxProps> = (props) => {
  const { settings } = useSeismicSettings();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const filePath = useCallback((event: SeismicSettings['event'], dataSet: SeismicSettings['dataSet']) => {
    return `./data/${dataSet}/training/plots/${event}.png`;
  }, []);

  if (!settings.event) {
    return <Box
      {...props}
      padding="2"
      width="400px"
    >
      <Heading as="h2" size="sm">No event selected</Heading>
    </Box>
  }

  return <Box
    {...props}
    padding="2"
    width="400px"
  >
    <Heading as="h2" size="sm">{settings.event}</Heading>
    Confidence: 0.8

    <br />
    <Image
      maxWidth="100%"
      src={filePath(settings.event, settings.dataSet)}
      alt={`${settings.event} seismic event`}
      onClick={onOpen}
      cursor="zoom-in"
    />
    <Flex>
      <Button onClick={onOpen} margin="auto" cursor="pointer">Magnify</Button>
    </Flex>

    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">{`${settings.event} seismic event`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody justifyContent="center" display="flex" textAlign="center">
          <Image
            src={filePath(settings.event, settings.dataSet)}
            alt={`${settings.event} seismic event`}
          />
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button variant='ghost'>Previous event</Button>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant='ghost'>Next event</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
};

export default PanelSide;
