import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const Desafio200Depositos = () => {
  const [selectedValues, setSelectedValues] = useState(new Set());
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Gera os 200 valores (1 a 200)
  const values = Array.from({ length: 200 }, (_, i) => i + 1);

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem('desafio-depositos');
        if (saved) {
          const data = JSON.parse(saved);
          setSelectedValues(new Set(data.selected || []));
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.log('Nenhum dado salvo anteriormente');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Salva dados sempre que houver mudança
  const saveData = (selected, newTotal) => {
    try {
      localStorage.setItem('desafio-depositos', JSON.stringify({
        selected: Array.from(selected),
        total: newTotal
      }));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleClick = (value) => {
    const newSelected = new Set(selectedValues);
    let newTotal = total;

    if (newSelected.has(value)) {
      newSelected.delete(value);
      newTotal -= value;
    } else {
      newSelected.add(value);
      newTotal += value;
    }

    setSelectedValues(newSelected);
    setTotal(newTotal);
    saveData(newSelected, newTotal);
  };

  const resetChallenge = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso?')) {
      setSelectedValues(new Set());
      setTotal(0);
      try {
        localStorage.removeItem('desafio-depositos');
      } catch (error) {
        console.error('Erro ao resetar:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-purple-600 font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-purple-700 mb-2">
            DESAFIO DOS 200 DEPÓSITOS
          </h1>
          <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
            Meta: R$ 20.000,00
          </p>
          
          {/* Progresso */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base sm:text-lg font-semibold text-gray-700">Progresso</span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / 20000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>{selectedValues.size} de 200 valores ({((selectedValues.size / 200) * 100).toFixed(1)}%)</span>
              <span>{((total / 20000) * 100).toFixed(1)}% da meta</span>
            </div>
          </div>

          <button
            onClick={resetChallenge}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors text-sm sm:text-base"
          >
            Resetar Desafio
          </button>
        </div>

        {/* Grade de Valores */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <p className="text-center text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
            👇 Clique nos valores que você já guardou
          </p>
          
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
            {values.map((value) => {
              const isSelected = selectedValues.has(value);
              return (
                <button
                  key={value}
                  onClick={() => handleClick(value)}
                  className={`
                    relative h-11 sm:h-12 md:h-14 flex items-center justify-center 
                    rounded-md sm:rounded-lg font-bold text-xs sm:text-sm
                    transition-all duration-200 transform active:scale-95
                    ${isSelected 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg' 
                      : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 hover:scale-105'
                    }
                  `}
                >
                  <span className="relative z-10">{value}</span>
                  {isSelected && (
                    <Check className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-4 sm:mt-6 text-gray-600 text-xs sm:text-sm space-y-1">
          <p>💰 Guarde cada valor apenas uma vez</p>
          <p>📊 Seu progresso é salvo automaticamente</p>
          <p className="text-purple-600 font-semibold">Total de {values.length} valores disponíveis</p>
        </div>
      </div>
    </div>
  );
};

export default Desafio200Depositos;

