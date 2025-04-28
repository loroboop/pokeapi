import React, { useState } from "react";
import { Pokemon } from "../types/Pokemon";

interface Props {
  pokemon: Pokemon;
  onCorrect: () => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, onCorrect }) => {
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleGuess = () => {
    if (guess.trim().toLowerCase() === pokemon.name.toLowerCase()) {
      setFeedback("¡Correcto!");
      setRevealed(true);
      setTimeout(() => {
        setFeedback("");
        setGuess("");
        setRevealed(false);
        onCorrect();
      }, 1500);
    } else {
      setFeedback("¡Incorrecto! Intenta de nuevo.");
    }
  };

  return (
    <div
      style={{
        width: 260,
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        textAlign: "center",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={pokemon.sprites.front_default}
        alt="???"
        style={{
          filter: revealed ? "none" : "brightness(0%)",
          width: 96,
          height: 96,
        }}
      />

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Nombre del Pokémon"
          style={{
            padding: "8px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "90%",
          }}
        />
        <button
          onClick={handleGuess}
          style={{
            marginTop: 10,
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#3b4cca",
            color: "white",
            cursor: "pointer",
          }}
        >
          ¡Adivinar!
        </button>
      </div>

      <p style={{ marginTop: 15, fontWeight: "bold" }}>{feedback}</p>
    </div>
  );
};

export default PokemonCard;
