import { getChatbotSettingsForAdmin, getChatbotFaq, getChatbotKeywords } from "@/lib/data"
import { ChatbotForm } from "./chatbot-form"
import { ChatbotFaqForm } from "./chatbot-faq-form"
import { ChatbotKeywordsForm } from "./chatbot-keywords-form"
import { ChatbotMonitoringForm } from "./chatbot-monitoring-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminChatbotPage() {
  const [data, faq, keywords] = await Promise.all([
    getChatbotSettingsForAdmin(),
    getChatbotFaq(),
    getChatbotKeywords(),
  ])
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Pengaturan Chatbot</h1>
      <p className="mb-6 text-muted-foreground">
        Atur API key Gemini, pertanyaan-jawaban, keyword, dan pantau penggunaan token chatbot.
      </p>
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          <TabsTrigger value="faq">Pertanyaan & Jawaban (FAQ)</TabsTrigger>
          <TabsTrigger value="keywords">Keyword</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <ChatbotForm data={data} />
        </TabsContent>
        <TabsContent value="faq">
          <ChatbotFaqForm faq={faq} />
        </TabsContent>
        <TabsContent value="keywords">
          <ChatbotKeywordsForm keywords={keywords} />
        </TabsContent>
        <TabsContent value="monitoring">
          <ChatbotMonitoringForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
