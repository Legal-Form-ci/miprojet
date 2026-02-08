import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Wand2, Loader2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Link2, Image, Video, Upload, AlignLeft, AlignCenter, AlignRight,
  Table, Palette, Type, Sparkles
} from "lucide-react";

interface EditorField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'upload-image' | 'upload-video' | 'tags';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  maxSize?: number; // in MB
}

interface UniversalAIEditorProps {
  fields: EditorField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  contentFieldName?: string;
  onAIGenerate?: () => void;
  storageFolder?: string;
}

export const UniversalAIEditor = ({
  fields,
  values,
  onChange,
  contentFieldName = 'content',
  storageFolder = 'news-media'
}: UniversalAIEditorProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // AI Generation function - Universal
  const generateWithAI = async () => {
    const content = values[contentFieldName];
    if (!content || content.length < 50) {
      toast({ 
        title: "Contenu insuffisant", 
        description: "Écrivez au moins 50 caractères de contenu brut pour générer avec l'IA", 
        variant: "destructive" 
      });
      return;
    }

    setGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: {
          action: 'generate_universal_content',
          content: content,
          fields: fields.map(f => ({ name: f.name, type: f.type, options: f.options }))
        }
      });

      if (error) throw error;

      if (data) {
        // Update all fields from AI response
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            onChange(key, data[key]);
          }
        });
        
        toast({ 
          title: "✨ Génération réussie", 
          description: "Tous les champs ont été remplis automatiquement par l'IA" 
        });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      // Fallback: generate locally
      generateLocally();
    } finally {
      setGenerating(false);
    }
  };

  const generateLocally = () => {
    const content = values[contentFieldName] || '';
    const lines = content.split('\n').filter((l: string) => l.trim());
    const generatedTitle = lines[0]?.substring(0, 80) || "Contenu MIPROJET";
    const generatedExcerpt = content.substring(0, 200) + "...";
    
    // Auto-detect category from content
    const contentLower = content.toLowerCase();
    let detectedCategory = "general";
    if (contentLower.includes("formation") || contentLower.includes("atelier")) detectedCategory = "training";
    else if (contentLower.includes("financement") || contentLower.includes("investissement")) detectedCategory = "funding";
    else if (contentLower.includes("partenariat") || contentLower.includes("accord")) detectedCategory = "partnerships";
    else if (contentLower.includes("opportunité") || contentLower.includes("appel")) detectedCategory = "opportunities";
    else if (contentLower.includes("projet")) detectedCategory = "projects";
    else if (contentLower.includes("événement") || contentLower.includes("conférence")) detectedCategory = "events";

    // Generate hashtags
    const hashtags = ["#MIPROJET", "#Entrepreneuriat", "#Afrique"];
    if (detectedCategory === "funding") hashtags.push("#Financement");
    if (detectedCategory === "opportunities") hashtags.push("#Opportunités");

    // Format content with proper structure
    const paragraphs = content.split('\n\n').filter((p: string) => p.trim());
    let formattedContent = "";
    
    paragraphs.forEach((p: string, i: number) => {
      if (i === 0) {
        formattedContent += `🚀 ${p.toUpperCase().substring(0, 60)}\n\n`;
        formattedContent += `${p}\n\n`;
      } else if (p.includes(':') || p.length < 50) {
        formattedContent += `📌 ${p.toUpperCase()}\n\n`;
      } else {
        formattedContent += `${p}\n\n`;
      }
    });

    formattedContent += `\n\n${hashtags.join(' ')}`;
    
    // Update fields
    if (fields.find(f => f.name === 'title')) onChange('title', generatedTitle);
    if (fields.find(f => f.name === 'excerpt')) onChange('excerpt', generatedExcerpt);
    if (fields.find(f => f.name === 'category')) onChange('category', detectedCategory);
    onChange(contentFieldName, formattedContent);
    
    toast({ 
      title: "✅ Génération locale", 
      description: "Contenu structuré automatiquement" 
    });
  };

  // File upload handler
  const handleFileUpload = async (fieldName: string, file: File, maxSize: number, type: 'image' | 'video') => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({ 
        title: "Fichier trop volumineux", 
        description: `Maximum ${maxSize} Mo pour les ${type === 'image' ? 'images' : 'vidéos'}`, 
        variant: "destructive" 
      });
      return;
    }

    setUploading(fieldName);
    
    try {
      const fileName = `${storageFolder}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { data, error } = await supabase.storage
        .from(storageFolder)
        .upload(fileName, file, { upsert: true });
      
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(storageFolder).getPublicUrl(fileName);
      onChange(fieldName, urlData.publicUrl);
      toast({ title: "✅ Upload réussi", description: `${type === 'image' ? 'Image' : 'Vidéo'} téléchargée` });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({ 
        title: "Erreur d'upload", 
        description: "Utilisez une URL externe ou réessayez", 
        variant: "destructive" 
      });
    } finally {
      setUploading(null);
    }
  };

  // Text formatting helpers for WYSIWYG-like experience
  const insertFormat = (before: string, after: string = "") => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = values[contentFieldName] || '';
    const selectedText = content.substring(start, end);
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    onChange(contentFieldName, newContent);
    
    // Focus back and adjust cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 10);
  };

  const renderField = (field: EditorField) => {
    const value = values[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
            <Input
              id={field.name}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Select value={value} onValueChange={(v) => onChange(field.name, v)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Sélectionnez..."} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'upload-image':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              {field.label} (max {field.maxSize || 20} Mo)
            </Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                disabled={uploading === field.name}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(field.name, file, field.maxSize || 20, 'image');
                }}
              />
              {value && (
                <div className="relative">
                  <img src={value} alt="Aperçu" className="h-24 w-auto object-cover rounded border" />
                </div>
              )}
              {uploading === field.name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Téléchargement en cours...
                </div>
              )}
            </div>
          </div>
        );

      case 'upload-video':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              {field.label} (max {field.maxSize || 500} Mo)
            </Label>
            <div className="space-y-2">
              <Input
                type="file"
                accept="video/*"
                disabled={uploading === field.name}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(field.name, file, field.maxSize || 500, 'video');
                }}
              />
              {value && (
                <video src={value} className="h-24 w-auto rounded border" controls />
              )}
              {uploading === field.name && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Téléchargement en cours...
                </div>
              )}
            </div>
          </div>
        );

      case 'tags':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder="#tag1 #tag2 #tag3"
            />
            <p className="text-xs text-muted-foreground">Séparez les hashtags par des espaces</p>
          </div>
        );

      case 'textarea':
      default:
        return null; // Handled separately as main content editor
    }
  };

  // Find the main content field
  const contentField = fields.find(f => f.name === contentFieldName);
  const otherFields = fields.filter(f => f.name !== contentFieldName && f.type !== 'textarea');
  const excerptField = fields.find(f => f.name === 'excerpt');

  return (
    <div className="space-y-6">
      {/* AI Generation Button - Prominent */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">🤖 Éditeur Universel IA</p>
                <p className="text-sm text-muted-foreground">
                  Écrivez votre contenu brut, puis cliquez sur "Générer" pour remplir automatiquement tous les champs
                </p>
              </div>
            </div>
            <Button 
              type="button" 
              onClick={generateWithAI}
              disabled={generating}
              size="lg"
              className="min-w-[180px]"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Générer avec IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Standard fields grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {otherFields.map(field => renderField(field))}
      </div>

      {/* Excerpt field if exists */}
      {excerptField && (
        <div className="space-y-2">
          <Label>{excerptField.label}</Label>
          <Textarea
            value={values[excerptField.name] || ''}
            onChange={(e) => onChange(excerptField.name, e.target.value)}
            rows={2}
            placeholder="Sera généré automatiquement par l'IA..."
          />
        </div>
      )}

      {/* Main Content Editor with WYSIWYG Toolbar */}
      {contentField && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold">{contentField.label} *</Label>
          
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 p-3 bg-muted/50 rounded-t-lg border border-b-0">
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("**", "**")} title="Gras">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" onClick={() => insertFormat("_", "_")} title="Italique">
                <Italic className="h-4 w-4" />
              </Toggle>
            </div>
            
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("\n\n📌 ", "\n")} title="Titre principal">
                <Heading1 className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n\n🔹 ", "\n")} title="Sous-titre">
                <Heading2 className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n\n▸ ", "")} title="Titre 3">
                <Heading3 className="h-4 w-4" />
              </Toggle>
            </div>
            
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("\n• ", "")} title="Liste à puces">
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n1. ", "")} title="Liste numérotée">
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </div>
            
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat('\n\n"', '"\n')} title="Citation">
                <Quote className="h-4 w-4" />
              </Toggle>
              <Toggle size="sm" onClick={() => insertFormat("[", "](lien)")} title="Lien">
                <Link2 className="h-4 w-4" />
              </Toggle>
            </div>
            
            <div className="flex gap-1">
              <Toggle size="sm" onClick={() => insertFormat("\n\n| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| ", " |  |  |\n")} title="Tableau">
                <Table className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
          
          {/* Content Textarea */}
          <Textarea
            ref={contentRef}
            value={values[contentFieldName] || ''}
            onChange={(e) => onChange(contentFieldName, e.target.value)}
            rows={16}
            required={contentField.required}
            placeholder="✍️ Écrivez librement votre contenu ici...

L'IA le structurera automatiquement avec :
• Titres en majuscules avec emojis
• Paragraphes bien séparés
• Listes organisées
• Hashtags pertinents
• Format professionnel et lisible

Cliquez sur 'Générer avec IA' pour la magie ! 🪄"
            className="rounded-t-none font-sans text-sm leading-relaxed min-h-[400px]"
          />
          <p className="text-xs text-muted-foreground">
            💡 Astuce : L'IA génère du contenu professionnel avec emojis, titres en gras, paragraphes structurés. Pas de HTML ni Markdown visible.
          </p>
        </div>
      )}
    </div>
  );
};
