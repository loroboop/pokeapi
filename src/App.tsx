import React, { useEffect, useState, useRef } from "react";
import "./App.css";

interface SimplePokemon {
  name: string;
  image: string;
}

function App() {
  const [pokemon, setPokemon] = useState<SimplePokemon | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showImage, setShowImage] = useState(false);
  const [message, setMessage] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [allowGuess, setAllowGuess] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [effectClass, setEffectClass] = useState("");
  const maxAttempts = 5;

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);
  const newPokemonSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
    newPokemonSound.current = new Audio("/sounds/new-pokemon.mp3");
    getRandomPokemon();
  }, []);

  const getRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await res.json();
    setPokemon({
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
    });
    setShowImage(false);
    setInput("");
    setMessage("");
    setHasGuessed(false);
    setAllowGuess(true);
    setAttempts(0);
    setEffectClass("");
    newPokemonSound.current?.play().catch(() => {});
  };

  const handleGuess = () => {
    if (!pokemon || !allowGuess || showImage) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (input.trim().toLowerCase() === pokemon.name.toLowerCase()) {
      setScore(score + 5);
      setLevel(level + 1);
      setMessage("¡Correcto! 🎉");
      setShowImage(true);
      setHasGuessed(true);
      setAllowGuess(false);
      setEffectClass("correct-effect");
      setTimeout(() => setEffectClass(""), 800);
      correctSound.current?.play().catch(() => {});
    } else if (newAttempts >= maxAttempts) {
      setScore(Math.max(0, score - 5));
      setMessage(`¡Límite de intentos! Era ${pokemon.name.toUpperCase()}`);
      setShowImage(true);
      setHasGuessed(true);
      setAllowGuess(false);
      setEffectClass("fail-effect");
      setTimeout(() => setEffectClass(""), 800);
      wrongSound.current?.play().catch(() => {});
    } else {
      setScore(Math.max(0, score - 1));
      setMessage(`¡Incorrecto! Intenta de nuevo (${newAttempts}/${maxAttempts})`);
      wrongSound.current?.play().catch(() => {});
    }
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(1);
    getRandomPokemon();
  };

  const handleNext = () => {
    if (hasGuessed) {
      getRandomPokemon();
    }
  };

  const pokeballs = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 20 + 20}px`,
    delay: `${Math.random() * 20}s`
  }));

  return (
    <div className={`App ${effectClass}`}>
      {/* Fondo de Pokéballs flotantes */}
      <div className="pokeball-bg">
        {pokeballs.map(ball => (
          <div
            key={ball.id}
            className="pokeball"
            style={{
              left: ball.left,
              width: ball.size,
              height: ball.size,
              animationDelay: ball.delay
            }}
          />
        ))}
      </div>

      <h1>Adivina el Pokémon</h1>
      <p>Nivel: {level} | Puntaje: {score} | Intentos: {attempts} / {maxAttempts}</p>

      {pokemon && (
        <div>
          <img
            src={pokemon.image}
            alt="pokemon"
            style={{ filter: showImage ? "none" : "brightness(0%)" }}
            width={250}
          />
        </div>
      )}

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="¿Quién es ese Pokémon?"
          disabled={!allowGuess || showImage}
        />
        <button onClick={handleGuess} disabled={!allowGuess || showImage}>¡Adivinar!</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleNext} disabled={!hasGuessed}>Siguiente Pokémon</button>
        <button onClick={handleRestart}>Reiniciar Juego</button>
      </div>
    </div>
  );
}

export default App;
