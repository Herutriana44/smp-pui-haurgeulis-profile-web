"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BarChart3, MessageSquare } from "lucide-react"

type UsageLog = {
  id: string
  job_id: string | null
  model: string | null
  prompt_tokens: number | null
  completion_tokens: number | null
  total_tokens: number | null
  system_prompt_preview: string | null
  user_message_preview: string | null
  created_at: string
}

type UsageResponse = {
  logs: UsageLog[]
  summary: {
    totalRequests: number
    totalPromptTokens: number
    totalCompletionTokens: number
    totalTokens: number
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

export function ChatbotMonitoringForm() {
  const [data, setData] = useState<UsageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/chat-usage?limit=100")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat")
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const s = data?.summary ?? {
    totalRequests: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-base">Total Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.totalRequests}</p>
            <p className="text-xs text-muted-foreground">chat terakhir (100)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle className="text-base">Prompt Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.totalPromptTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">input ke model</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle className="text-base">Completion Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.totalCompletionTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">output dari model</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle className="text-base">Total Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{s.totalTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">prompt + completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Token & Prompt</CardTitle>
          <CardDescription>
            Log penggunaan token dan preview prompt per request chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!data?.logs?.length ? (
            <p className="text-muted-foreground">
              Belum ada data. Kirim pesan lewat chatbot untuk melihat log.
            </p>
          ) : (
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Prompt</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="max-w-[200px]">Pesan User</TableHead>
                    <TableHead className="max-w-[300px]">System Prompt (preview)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.model || "-"}</Badge>
                      </TableCell>
                      <TableCell>{log.prompt_tokens ?? 0}</TableCell>
                      <TableCell>{log.completion_tokens ?? 0}</TableCell>
                      <TableCell>{log.total_tokens ?? 0}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs" title={log.user_message_preview ?? ""}>
                        {log.user_message_preview || "-"}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-xs" title={log.system_prompt_preview ?? ""}>
                        {log.system_prompt_preview || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
