import { Wrap, WrapItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PersonCard from "./PersonCard";
import type { PersonWithId } from "../types";

type Props = {
  people: PersonWithId[];
};

export default function ParentsRow({ people }: Props) {
  if (people.length === 0) return null;
  return (
    <Wrap gap={4} justify="center">
      {people.map((p) => (
        <WrapItem key={p.id}>
          <Link to={`/person/${p.id}`} style={{ textDecoration: "none" }}>
            <PersonCard personId={p.id} />
          </Link>
        </WrapItem>
      ))}
    </Wrap>
  );
}
