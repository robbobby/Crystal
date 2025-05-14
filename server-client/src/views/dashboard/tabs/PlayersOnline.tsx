import React, { useState } from "react";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useMirPlayersOnline } from "../../../contexts/MirPlayersOnlineContext";
import { MirClassDisplay } from "../../../components/mirDataHelpers/MirClass";
import { MirGenderDisplay } from "../../../components/mirDataHelpers/MirGender";
import { MirClass } from "../../../model/serverStuff/mirClass";
import { MirGender } from "../../../model/serverStuff/mirGender";

type Order = "asc" | "desc";
type Column = "id" | "name" | "level" | "class" | "gender";

interface HeadCell {
  id: Column;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "id", label: "ID", numeric: true },
  { id: "name", label: "Name", numeric: false },
  { id: "level", label: "Level", numeric: true },
  { id: "class", label: "Class", numeric: false },
  { id: "gender", label: "Gender", numeric: false },
];

const CharacterTable: React.FC = () => {
  const characterstuff = useMirPlayersOnline();
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<
    number | null
  >(null);
  const [orderBy, setOrderBy] = useState<Column>("id");
  const [order, setOrder] = useState<Order>("asc");

  const characters = [
    ...characterstuff.characters,
    {
      id: 0,
      name: "Archer",
      level: 0,
      class: MirClass.Warrior,
      gender: MirGender.Male,
    },
    {
      id: 1,
      name: "Wizard",
      level: 0,
      class: MirClass.Wizard,
      gender: MirGender.Female,
    },
    {
      id: 2,
      name: "Taoist",
      level: 0,
      class: MirClass.Taoist,
      gender: MirGender.Female,
    },
    {
      id: 3,
      name: "Assassin",
      level: 0,
      class: MirClass.Assassin,
      gender: MirGender.Male,
    },
    {
      id: 4,
      name: "Archer",
      level: 0,
      class: MirClass.Archer,
      gender: MirGender.Male,
    },
    {
      id: 0,
      name: "Archer",
      level: 0,
      class: MirClass.Warrior,
      gender: MirGender.Male,
    },
    {
      id: 1,
      name: "Wizard",
      level: 0,
      class: MirClass.Wizard,
      gender: MirGender.Female,
    },
    {
      id: 2,
      name: "Taoist",
      level: 0,
      class: MirClass.Taoist,
      gender: MirGender.Female,
    },
    {
      id: 3,
      name: "Assassin",
      level: 0,
      class: MirClass.Assassin,
      gender: MirGender.Male,
    },
    {
      id: 4,
      name: "Archer",
      level: 0,
      class: MirClass.Archer,
      gender: MirGender.Male,
    },
    {
      id: 0,
      name: "Archer",
      level: 0,
      class: MirClass.Warrior,
      gender: MirGender.Male,
    },
    {
      id: 1,
      name: "Wizard",
      level: 0,
      class: MirClass.Wizard,
      gender: MirGender.Female,
    },
    {
      id: 2,
      name: "Taoist",
      level: 0,
      class: MirClass.Taoist,
      gender: MirGender.Female,
    },
    {
      id: 3,
      name: "Assassin",
      level: 0,
      class: MirClass.Assassin,
      gender: MirGender.Male,
    },
    {
      id: 4,
      name: "Archer",
      level: 0,
      class: MirClass.Archer,
      gender: MirGender.Male,
    },
    {
      id: 0,
      name: "Archer",
      level: 0,
      class: MirClass.Warrior,
      gender: MirGender.Male,
    },
    {
      id: 1,
      name: "Wizard",
      level: 0,
      class: MirClass.Wizard,
      gender: MirGender.Female,
    },
    {
      id: 2,
      name: "Taoist",
      level: 0,
      class: MirClass.Taoist,
      gender: MirGender.Female,
    },
    {
      id: 3,
      name: "Assassin",
      level: 0,
      class: MirClass.Assassin,
      gender: MirGender.Male,
    },
    {
      id: 4,
      name: "Archer",
      level: 0,
      class: MirClass.Archer,
      gender: MirGender.Male,
    },
  ];

  const handleOpenModal = (index: number) => {
    setSelectedCharacterIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedCharacterIndex(null);
  };

  const handleRequestSort = (property: Column) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCharacters = [...characters].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (order === "desc") {
      if (bValue < aValue) return -1;
      if (bValue > aValue) return 1;
    } else {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    }
    return 0;
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="character table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCharacters.map((character, index) => (
              <TableRow
                key={character.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
                onClick={() => handleOpenModal(index)}
              >
                <TableCell align={"left"}>{character.id}</TableCell>
                <TableCell component="th" scope="row">
                  {character.name}
                </TableCell>
                <TableCell align={"left"}>{character.level}</TableCell>
                <TableCell align={"left"}>
                  <MirClassDisplay>{character.class}</MirClassDisplay>
                </TableCell>
                <TableCell align={"left"}>
                  <MirGenderDisplay>{character.gender}</MirGenderDisplay>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={selectedCharacterIndex !== null}
        onClose={handleCloseModal}
        aria-labelledby="character-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedCharacterIndex !== null && (
            <div>
              <h2>Character Details</h2>
              <p>Character Index: {selectedCharacterIndex}</p>
              <p>Character ID: {characters[selectedCharacterIndex].id}</p>
              <p>Name: {characters[selectedCharacterIndex].name}</p>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default CharacterTable;
