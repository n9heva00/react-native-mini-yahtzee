import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

let board = [];
let totalPoints = 0;

const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const BONUS_POINTS = 63;

export default function Gameboard() {

  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState('Throw dices.');
  const [bonusStatus, setBonusStatus] = useState('');
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  const [selectedPoints, setSelectedPoints] = useState(new Array(6).fill(false));
  const [selectedPointsAmount, setSelectedPointsAmount] = useState(new Array(6).fill(0));
  const [gameOver, setGameOver] = useState(false);

  const diceRow = [];
  for (let i = 0; i < NBR_OF_DICES; i++) {
    diceRow.push(
      <Pressable
        key={"diceRow" + i}
        onPress={() => selectDice(i)}>
        <MaterialCommunityIcons
          name={board[i]}
          key={"diceRow" + i}
          size={50}
          color={getDiceColor(i)}>
        </MaterialCommunityIcons>
      </Pressable>
    );
  }

  const pointsRow = [];
  for (let i = 0; i < 6; i++) {
    pointsRow.push(
      <Pressable
        key={"pointsRow" + i}
        onPress={() => selectPoints(i)}>
        <Text style={styles.points}>{selectedPointsAmount[i]}</Text>
        <MaterialCommunityIcons
          name={"numeric-" + (i + 1) + "-circle"}
          key={"pointsRow" + i}
          size={50}
          color={getPointsColor(i)}>
        </MaterialCommunityIcons>
      </Pressable>
    );
  }

  useEffect(() => {
    checkGameOver();
  }, [selectedPoints]);

  function throwDices() {
    if (nbrOfThrowsLeft === 0) {
      setStatus('Select your points.');
    } else {
      let selectedValue = "";
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (!selectedDices[i]) {
          let randomNumber = Math.floor(Math.random() * 6 + 1);
          board[i] = 'dice-' + randomNumber;
        } else {
          selectedValue = i;
        }
        selectDice(selectedValue, true);
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setStatus('Select and throw dices again.');
      }
    }
  }

  function selectDice(selected, chooseSameDices) {
    let dices = [...selectedDices];

    if (nbrOfThrowsLeft === 3) {
      setStatus('You have to throw dices first.');
    } else if (dices[selected] && !chooseSameDices) {
      setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    } else {
      for (let i = 0; i < NBR_OF_DICES; i++) {
        dices[i] = (board[i] === board[selected]) ? true : false;
      }
      setSelectedDices(dices);
    }
  }

  function getDiceColor(i) {
    return selectedDices[i] ? "black" : "steelblue";
  }

  function getPointsColor(i) {
    return selectedPoints[i] ? "black" : "steelblue";
  }

  function checkBonus() {
    if (totalPoints >= BONUS_POINTS) {
      setBonusStatus('You got the bonus!');
    }
    else {
      setBonusStatus('You are ' + (BONUS_POINTS - totalPoints) + ' away from the bonus.');
    }
  }

  function selectPoints(selected) {
    if (nbrOfThrowsLeft === 0) {
      let points = [...selectedPoints];
      let pointsAmount = [...selectedPointsAmount];
      if (selectedPoints[selected] === false) {
        let sum = 0;
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (board[i] === "dice-" + (selected + 1)) {
            sum += (selected + 1)
          }
        }
        points[selected] = true;
        pointsAmount[selected] = sum;
        totalPoints += sum;
        setNbrOfThrowsLeft(3);
        checkBonus();
      } else if (gameOver) {
        return;
      } else {
        setStatus('You have already selected points for ' + (selected + 1) + '.');
      }
      setSelectedPoints(points);
      setSelectedPointsAmount(pointsAmount);
      setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    } else {
      setStatus('Throw 3 times before setting points.');
    }
  }

  function checkGameOver() {
    if (selectedPoints.every(x => x)) {
      setStatus('Game over. All points selected.');
      setSelectedDices(new Array(NBR_OF_DICES).fill(false));
      setNbrOfThrowsLeft(0);
      setGameOver(true);
      board = [];
    }
  }

  function resetGame() {
    totalPoints = 0;
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setStatus('Throw dices.');
    setBonusStatus('');
    setSelectedPoints(new Array(6).fill(false));
    setSelectedPointsAmount(new Array(6).fill(0));
    setGameOver(false);
  }

  return (
    <View style={styles.gameboard}>
      <View style={styles.flex}>{diceRow}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      {gameOver ?
        <Pressable
          style={styles.button}
          onPress={() => resetGame()}>
          <Text style={styles.buttonText}>Reset game</Text>
        </Pressable>
        :
        <Pressable
          style={styles.button}
          onPress={() => throwDices()}>
          <Text style={styles.buttonText}>Throw dices</Text>
        </Pressable>
        }
      <Text style={styles.gameinfo}>Total: {totalPoints}</Text>
      <Text style={styles.gameinfo}>{bonusStatus}</Text>
      <View style={styles.flex}>{pointsRow}</View>
    </View>
  )
}