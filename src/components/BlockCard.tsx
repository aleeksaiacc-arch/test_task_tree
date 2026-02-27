import { Card, CardBody, Heading, Text, Box, HStack } from "@chakra-ui/react";

export type BlockAddition = "left" | "right" | "none";

export type RootBlock = {
  id: string;
  addition: BlockAddition;
};

type Props = RootBlock & {
  number: number;
};

const BLOCK_WIDTH = "300px";

function AdditionBlock() {
  return (
    <Card w={BLOCK_WIDTH} flexShrink={0}>
      <CardBody>
        <Box h="120px" bg="gray.100" borderRadius="md" />
        <Heading size="md" mt={2} noOfLines={3} color="gray.400" fontWeight="normal">
          —
        </Heading>
        <Text fontSize="sm" color="gray.400" mt={1}>
          —
        </Text>
      </CardBody>
    </Card>
  );
}

export default function BlockCard({ id, addition, number }: Props) {
  return (
    <HStack spacing={4} justify="center" align="flex-start" w="100%" data-block-id={id}>
      <Box w={BLOCK_WIDTH} flexShrink={0}>
        {addition === "left" && <AdditionBlock />}
      </Box>
      <Card w={BLOCK_WIDTH} flexShrink={0} id={id}>
        <CardBody>
          <Box h="120px" bg="gray.100" borderRadius="md" />
          <Heading size="md" mt={2} noOfLines={3} color="gray.600" fontWeight="normal">
            {number}
          </Heading>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {number}
          </Text>
        </CardBody>
      </Card>
      <Box w={BLOCK_WIDTH} flexShrink={0}>
        {addition === "right" && <AdditionBlock />}
      </Box>
    </HStack>
  );
}
