"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Fish {
  id: string;
  name: string;
  characteristics: string[];
}

interface Characteristic {
  id: string;
  description: string;
}

const fishData : Fish[] = [
  { id: "A1", name: "Ikan Tuna", characteristics: ["B1", "B15"] },
  { id: "A2", name: "Ikan Hiu", characteristics: ["B2", "B14"] },
  { id: "A3", name: "Ikan Barracuda", characteristics: ["B3", "B19"] },
  { id: "A4", name: "Ikan Clownfish", characteristics: ["B16", "B17"] },
  { id: "A5", name: "Ikan Marlin", characteristics: ["B5", "B19"] },
  { id: "A6", name: "Ikan Sarden", characteristics: ["B6", "B15"] },
  { id: "A7", name: "Ikan Napoleon Wrasse", characteristics: ["B7", "B18"] },
  { id: "A8", name: "Ikan Kerapu", characteristics: ["B8", "B20"] },
  { id: "A9", name: "Ikan Pari", characteristics: ["B9", "B13"] },
  { id: "A10", name: "Ikan Bawal", characteristics: ["B10", "B11", "B12"] },
];

const characteristicsData : Characteristic[] = [
  { id: "B1", description: "Tubuh berbentuk cerutu menyerupai torpedo" },
  { id: "B2", description: "Tubuh ramping" },
  { id: "B3", description: "Kemampuan untuk beradaptasi dengan suhu air yang berfluktuasi" },
  { id: "B4", description: "Tubuh besar" },
  { id: "B5", description: "Tubuh lonjong" },
  { id: "B6", description: "Ukuran tubuh panjang" },
  { id: "B7", description: "Memiliki tombak bundar yang memanjang di moncongnya" },
  { id: "B8", description: "Memiliki bibir tebal" },
  { id: "B9", description: "Memiliki mulut lebar" },
  { id: "B10", description: "Berbadan kekar dan berotot" },
  { id: "B11", description: "Tubuh gepeng & lebar" },
  { id: "B12", description: "Tubuh oval & pipih" },
  { id: "B13", description: "Memiliki warna cokelat" },
  { id: "B14", description: "Memiliki warna abu-abu" },
  { id: "B15", description: "Memiliki warna putih-keperakan" },
  { id: "B16", description: "Memiliki warna oranye" },
  { id: "B17", description: "Memiliki garis-garis putih di tubuhnya" },
  { id: "B18", description: "Memiliki warna hijau" },
  { id: "B19", description: "Memiliki warna biru gelap hingga hitam" },
  { id: "B20", description: "Memiliki bintik-bintik pada tubuhnya" },
  { id: "B21", description: "Memiliki warna biru" },
];


const ExpertSystem = () => {
  const [availableFish, setAvailableFish] = useState<Fish[]>(fishData);
  const [blacklistedFish, setBlacklistedFish] = useState<Set<string>>(new Set());
  const [answeredCharacteristics, setAnsweredCharacteristics] = useState<Set<string>>(new Set());
  const [currentCharacteristic, setCurrentCharacteristic] = useState<string>('B1');
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished' | 'not_found'>('playing');
  const [result, setResult] = useState<Fish | null>(null);

  const getNextCharacteristic = (currentChar: string): string | null => {
    const charIndex = characteristicsData.findIndex(c => c.id === currentChar);
    if (charIndex === -1 || charIndex === characteristicsData.length - 1) return null;
  
    for (let i = charIndex + 1; i < characteristicsData.length; i++) {
      const nextChar = characteristicsData[i].id;
      // Periksa apakah karakteristik belum ditanyakan
      if (!answeredCharacteristics.has(nextChar)) {
        return nextChar;
      }
    }
    return null;
  };
  

  const checkForMatch = () => {
    const remainingFish = availableFish.filter(fish => !blacklistedFish.has(fish.id));
    
    for (const fish of remainingFish) {
      const allCharacteristicsMatched = fish.characteristics.every(char => 
        answeredCharacteristics.has(char)
      );
      
      if (allCharacteristicsMatched) {
        setResult(fish);
        setGameStatus('finished');
        return true;
      }
    }
    return false;
  };

  const handleAnswer = (answer: boolean) => {
    const newAnsweredChars = new Set(answeredCharacteristics);
    newAnsweredChars.add(currentCharacteristic);
    setAnsweredCharacteristics(newAnsweredChars);
  
    if (!answer) {
      // Jika "Tidak", masukkan ikan dengan karakteristik ini ke daftar hitam
      const newBlacklist = new Set(blacklistedFish);
      availableFish.forEach(fish => {
        if (fish.characteristics.includes(currentCharacteristic)) {
          newBlacklist.add(fish.id);
        }
      });
      setBlacklistedFish(newBlacklist);
    }
  
    // Dapatkan ikan yang tersisa
    const remainingFish = availableFish.filter(fish => !blacklistedFish.has(fish.id));
  
    if (remainingFish.length === 1) {
      // Jika hanya satu ikan tersisa, tanyakan karakteristik yang dimilikinya
      const fish = remainingFish[0];
      const nextChar = fish.characteristics.find(
        char => !answeredCharacteristics.has(char)
      );
      if (nextChar) {
        setCurrentCharacteristic(nextChar);
      } else {
        // Jika semua karakteristik cocok, pilih ikan tersebut
        setResult(fish);
        setGameStatus('finished');
      }
      return;
    }
  
    // Jika tidak ada ikan tersisa
    if (remainingFish.length === 0) {
      setGameStatus('not_found');
      return;
    }
  
    // Jika ada lebih dari satu ikan, lanjutkan ke karakteristik berikutnya
    const nextChar = getNextCharacteristic(currentCharacteristic);
    if (!nextChar) {
      if (!checkForMatch()) {
        setGameStatus('not_found');
      }
    } else {
      setCurrentCharacteristic(nextChar);
      checkForMatch();
    }
  };
  

  const resetGame = () => {
    setAvailableFish(fishData);
    setBlacklistedFish(new Set());
    setAnsweredCharacteristics(new Set());
    setCurrentCharacteristic('B1');
    setGameStatus('playing');
    setResult(null);
  };

  const getCurrentQuestion = () => {
    const char = characteristicsData.find(c => c.id === currentCharacteristic);
    return char ? char.description : '';
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 border border-gray-300 rounded-xl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sistem Pakar Identifikasi Ikan</CardTitle>
        </CardHeader>
        <CardContent>
          {gameStatus === 'playing' && (
            <div className="space-y-4">
              <p className="text-lg font-medium">Apakah ikan tersebut {getCurrentQuestion()}?</p>
              <div className="flex gap-4">
                <Button onClick={() => handleAnswer(true)} className="w-full">
                  Ya
                </Button>
                <Button onClick={() => handleAnswer(false)} className="w-full">
                  Tidak
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Ikan yang masih mungkin: {availableFish.filter(fish => !blacklistedFish.has(fish.id)).length}
              </p>
            </div>
          )}

          {gameStatus === 'finished' && result && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Ikan yang anda maksud adalah: <strong>{result.name}</strong>
                </AlertDescription>
              </Alert>
              <Button onClick={resetGame} className="w-full">
                Mulai Lagi
              </Button>
            </div>
          )}

          {gameStatus === 'not_found' && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Maaf, tidak dapat menemukan ikan yang sesuai dengan kriteria yang diberikan.
                </AlertDescription>
              </Alert>
              <Button onClick={resetGame} className="w-full">
                Mulai Lagi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {gameStatus === 'finished' && result && (
      <div className="space-y-4 max-w-2xl mx-auto mt-10">
        <Alert>
          <AlertDescription>
            Ikan yang Anda maksud adalah: <strong>{result.name}</strong>
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <p className="font-medium">Ciri-ciri ikan:</p>
          <ul className="list-disc list-inside text-gray-700">
            {result.characteristics.map((charId) => {
              const characteristic = characteristicsData.find((c) => c.id === charId);
              return (
                <li key={charId}>
                  {characteristic ? characteristic.description : `Ciri tidak ditemukan (ID: ${charId})`}
                </li>
              );
            })}
          </ul>
        </div>
        <Button onClick={resetGame} className="w-full">
          Mulai Lagi
        </Button>
      </div>
    )}

    </div>
    
          
  );
};

export default ExpertSystem;