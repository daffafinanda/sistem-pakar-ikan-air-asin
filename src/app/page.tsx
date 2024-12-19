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

const characteristicsData: Characteristic[] = [
  { id: 'B1', description: 'Hidup di laut dengan kadar garam tinggi' },
  { id: 'B2', description: 'Memiliki warna tubuh cerah' },
  { id: 'B3', description: 'Bentuk tubuh ramping dan aerodinamis' },
  { id: 'B4', description: 'Sisik lebih tebal dan keras' },
  { id: 'B5', description: 'Memiliki kemampuan osmoregulasi' },
  { id: 'B6', description: 'Insang yang efisien untuk menyaring oksigen' },
  { id: 'B7', description: 'Sering hidup berkelompok' },
  { id: 'B8', description: 'Sirip kuat untuk menghadapi arus laut' },
  { id: 'B9', description: 'Bertelur di tempat tertentu' },
  { id: 'B10', description: 'Pola makan beragam' },
  { id: 'B11', description: 'Beberapa memiliki tubuh pipih' },
  { id: 'B12', description: 'Dapat beradaptasi dengan tekanan air laut' },
  { id: 'B13', description: 'Memiliki mata yang peka terhadap cahaya bawah laut' },
  { id: 'B14', description: 'Rata-rata ukuran tubuh lebih besar dari ikan air tawar' },
  { id: 'B15', description: 'Beberapa memiliki duri pada tubuhnya untuk perlindungan' }
];

const fishData: Fish[] = [
  { id: 'A1', name: 'Tuna', characteristics: ['B1', 'B2', 'B3', 'B6', 'B8', 'B9'] },
  { id: 'A2', name: 'Kakap Merah', characteristics: ['B1', 'B2', 'B4', 'B6', 'B8', 'B10'] },
  { id: 'A3', name: 'Kerapu', characteristics: ['B1', 'B4', 'B7', 'B9', 'B10'] },
  { id: 'A4', name: 'Pari', characteristics: ['B1', 'B11', 'B8', 'B12', 'B15'] },
  { id: 'A5', name: 'Hiu', characteristics: ['B1', 'B3', 'B4', 'B13', 'B14'] },
  { id: 'A6', name: 'Tenggiri', characteristics: ['B1', 'B2', 'B3', 'B6', 'B10'] },
  { id: 'A7', name: 'Baronang', characteristics: ['B1', 'B4', 'B7', 'B10', 'B11'] },
  { id: 'A8', name: 'Cakalang', characteristics: ['B1', 'B2', 'B3', 'B9', 'B10'] },
  { id: 'A9', name: 'Bandeng', characteristics: ['B1', 'B4', 'B6', 'B7', 'B10'] },
  { id: 'A10', name: 'Sardin', characteristics: ['B1', 'B2', 'B3', 'B10', 'B13'] },
  { id: 'A11', name: 'Layang', characteristics: ['B1', 'B2', 'B3', 'B6', 'B9'] },
  { id: 'A12', name: 'Tongkol', characteristics: ['B1', 'B2', 'B3', 'B10', 'B14'] },
  { id: 'A13', name: 'Salmon', characteristics: ['B1', 'B3', 'B6', 'B9', 'B12'] },
  { id: 'A14', name: 'Lumba-lumba (Mahi-Mahi)', characteristics: ['B1', 'B3', 'B5', 'B10', 'B14'] },
  { id: 'A15', name: 'Belut Laut', characteristics: ['B1', 'B11', 'B5', 'B12', 'B13'] },
  { id: 'A16', name: 'Kuwe', characteristics: ['B1', 'B3', 'B6', 'B9', 'B14'] },
  { id: 'A17', name: 'Kakap Hitam', characteristics: ['B1', 'B2', 'B4', 'B7', 'B10'] },
  { id: 'A18', name: 'Marlin', characteristics: ['B1', 'B3', 'B6', 'B12', 'B14'] },
  { id: 'A19', name: 'Ikan Dori', characteristics: ['B1', 'B3', 'B5', 'B8', 'B10'] },
  { id: 'A20', name: 'Ikan Setuhuk', characteristics: ['B1', 'B2', 'B3', 'B5', 'B12'] }
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