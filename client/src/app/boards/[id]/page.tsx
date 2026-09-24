import BoardView from "@/components/board/BoardView";

interface BoardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BoardPage({
  params,
}: BoardPageProps) {
  const { id } = await params;

  return <BoardView boardId={id} />;
}