import { Wrap, WrapItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PersonCard from "./PersonCard";
import type { Person } from "../types";

type Props = {
  people: Person[];
};

export default function ChildrenRow({ people }: Props) {
  if (people.length === 0) return null;
  return (
    <Wrap spacing={4} justify="center">
      {people.map((p) => (
        <WrapItem key={p.id}>
          <Link to={`/person/${p.id}`} style={{ textDecoration: "none" }}>
            <PersonCard person={p} />
          </Link>
        </WrapItem>
      ))}
    </Wrap>
  );
}
