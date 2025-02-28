import { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {
  const [frase, setFrase] = useState<string | null>(null);
  const [autor, setAutor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFraseMotivacional = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/frase-motivacional");
        setFrase(response.data.frase);
        setAutor(response.data.autor);
      } catch (error) {
        console.error("Erro ao buscar frase motivacional:", error);
        setFrase("Acredite em si mesmo e tudo será possível!");
        setAutor("Desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchFraseMotivacional();
  }, []);

  return (
    <footer className="bg-purple-800 p-4 text-center text-sm text-white">
      <p>© 2024 - Meu App Gerencial</p>
      <p className="mt-2 italic">
        {loading ? "Carregando frase motivacional..." : `"${frase}" - ${autor}`}
      </p>
    </footer>
  );
}
