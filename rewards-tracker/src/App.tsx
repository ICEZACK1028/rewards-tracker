import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tasks = [
  { name: "Completar una tarea de la universidad", points: 3 },
  { name: "Asistir a clase sin distraerte", points: 2 },
  { name: "Estudiar inglés (mínimo 30 min)", points: 2 },
  { name: "Hacer ejercicio (mínimo 30 min)", points: 3 },
  { name: "Avanzar en tu proyecto personal (mínimo 30 min)", points: 3 },
  { name: "Cumplir con el horario del día sin procrastinar", points: 5 },
  { name: "No usar redes sociales mientras estudias/trabajas", points: 4 },
  { name: "Dormir a la hora establecida (mínimo 7h)", points: 3 },
  { name: "Leer al menos 15 min", points: 2 },
];

const rewards = [
  { name: "Ver un episodio extra de una serie", cost: 10 },
  { name: "1 hora de juego sin remordimiento", cost: 15 },
  { name: "Comprar un café o snack especial", cost: 20 },
  { name: "Tarde libre sin tareas", cost: 30 },
  { name: "Comprar algo pequeño", cost: 50 },
  { name: "Día completo sin presión", cost: 70 },
];

export default function RewardsTracker() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<{ task: string; points: number; created_at: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("task_history").select("task_name, points, created_at").order("created_at", { ascending: false });
      if (!error) setHistory(data || []);

      const { data: pointsData } = await supabase.from("rewards").select("points").eq("id", 1).single();
      if (pointsData) setPoints(pointsData.points);
    };
    fetchData();
  }, []);

  const addPoints = async (task: { name: string; points: number }) => {
    const newPoints = points + task.points;
    setPoints(newPoints);

    await supabase.from("task_history").insert([{ task_name: task.name, points: task.points }]);
    setHistory([{ task: task.name, points: task.points, created_at: new Date().toISOString() }, ...history]);
    await supabase.from("rewards").update({ points: newPoints }).eq("id", 1);
  };

  const redeemReward = async (reward: { name: string; cost: number }) => {
    if (points >= reward.cost) {
      const newPoints = points - reward.cost;
      setPoints(newPoints);
      await supabase.from("rewards").update({ points: newPoints }).eq("id", 1);
    } else {
      alert("No tienes suficientes puntos");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎯 Plan de Recompensas</h1>
      <p className="text-lg">Puntos acumulados: <span className="font-bold">{points}</span></p>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">✅ Tareas</h2>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {tasks.map((task) => (
              <Button key={task.name} onClick={() => addPoints(task)}>
                {task.name} (+{task.points} pts)
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">🎁 Recompensas</h2>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {rewards.map((reward) => (
              <Button key={reward.name} onClick={() => redeemReward(reward)}>
                {reward.name} (-{reward.cost} pts)
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">📜 Historial</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.task}</TableCell>
                  <TableCell>{entry.points}</TableCell>
                  <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
