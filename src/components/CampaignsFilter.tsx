import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CampaignsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
  totalCampaigns: number;
  filteredCount: number;
}

export const CampaignsFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  totalCampaigns,
  filteredCount
}: CampaignsFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="paused">Pausadas</SelectItem>
              <SelectItem value="scheduled">Agendadas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Nome</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="progress">Progresso</SelectItem>
              <SelectItem value="audience">Audiência</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onSortOrderChange}
            title={`Ordenar ${sortOrder === "asc" ? "decrescente" : "crescente"}`}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>
            Mostrando {filteredCount} de {totalCampaigns} campanhas
          </span>
          {statusFilter !== "all" && (
            <Badge variant="outline" className="capitalize">
              {statusFilter === "active" && "Ativas"}
              {statusFilter === "paused" && "Pausadas"}
              {statusFilter === "scheduled" && "Agendadas"}
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-4">
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-whatsapp rounded-full"></div>
            <span>Ativas</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Pausadas</span>
          </span>
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Agendadas</span>
          </span>
        </div>
      </div>
    </div>
  );
};