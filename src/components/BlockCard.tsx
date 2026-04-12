import { Card, Heading, Text, Box, HStack } from "@chakra-ui/react";
import { cloudinaryUrl } from "../utils/cloudinary";

export type BlockAddition = "left" | "right" | "none";

export type RootBlock = {
  id: string;
  spouseId: string;
  familyId: string;
  addition: BlockAddition;
  firstName: string;
  lastName: string;
  position: "left" | "right";
  born?: string;
  death?: string;
  imgSrc?: string;
};

type Props = RootBlock & {
  number: number;
};

const BLOCK_WIDTH = "300px";

function AdditionBlock() {
  return (
    <Card.Root w={BLOCK_WIDTH} flexShrink={0}>
      <Card.Body>
        <Box h="120px" bg="gray.100" borderRadius="md" />
        <Heading
          size="md"
          mt={2}
          lineClamp={3}
          color="gray.400"
          fontWeight="normal"
        >
          —
        </Heading>
        <Text fontSize="sm" color="gray.400" mt={1}>
          —
        </Text>
      </Card.Body>
    </Card.Root>
  );
}

export default function BlockCard({
  id,
  addition,
  firstName,
  lastName,
  born,
  death,
  imgSrc,
}: Props) {
  const dates = [born, death].filter(Boolean).join(" – ");
  return (
    <HStack
      gap={4}
      justify="center"
      align="flex-start"
      w="100%"
      data-block-id={id}
    >
      <Box w={BLOCK_WIDTH} flexShrink={0}>
        {addition === "left" && <AdditionBlock />}
      </Box>
      <Card.Root w={BLOCK_WIDTH} flexShrink={0} id={id}>
        <Card.Body>
          <Box
            h="120px"
            bg="gray.100"
            borderRadius="md"
            overflow="hidden"
            backgroundImage={imgSrc ? `url(${cloudinaryUrl(imgSrc, { width: 600, height: 240 })})` : undefined}
            backgroundSize="cover"
            backgroundPosition="center"
          />
          <Heading
            size="md"
            mt={2}
            lineClamp={3}
            color="gray.600"
            fontWeight="normal"
          >
            {firstName} {lastName}
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {dates || "—"}
          </Text>
        </Card.Body>
      </Card.Root>
      <Box w={BLOCK_WIDTH} flexShrink={0}>
        {addition === "right" && <AdditionBlock />}
      </Box>
    </HStack>
  );
}
