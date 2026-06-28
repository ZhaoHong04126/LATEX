import { useState } from 'react';
import { BookOpen, Sparkles, Code, Share2, Cpu } from 'lucide-react';

const timelineEvents = [
  {
    year: '1977',
    title: 'TeX 系統誕生 ── 緣起於對排版品質的執著',
    author: 'Donald Knuth (高德納)',
    icon: Cpu,
    summary: '電腦科學巨擘高德納在修改其名著《電腦程式設計藝術》時，因無法忍受當時粗劣的數位排版品質，決定「暫停寫書」，動手開發 TeX 系統。',
    details: '高德納原以為只需要花幾個月的時間，沒想到這一「暫停」就是十幾年，最終誕生了 TeX 系統。TeX 擁有驚人的穩定性，幾乎沒有 Bug。高德納甚至為發現 TeX Bug 的人提供獎金，獎金額度從 $1.28 開始，每次翻倍，最高達 $327.68。',
    funFact: 'TeX 的版本號非常獨特，每次更新都會加上下一個圓周率的小數位，例如 3.14 -> 3.141 -> 3.1415... 逐漸逼近圓周率 π。當高德納去世時，該版本號將會永久固定為 π，此時所有的 Bug 將被視為「系統的特徵」。'
  },
  {
    year: '1984',
    title: 'LaTeX 問世 ── Lamport 的結構化革命',
    author: 'Leslie Lamport',
    icon: Code,
    summary: 'Leslie Lamport 為了撰寫自己的書籍，在 TeX 的底層語言基礎上開發了一套高階巨集套件，這就是 LaTeX（取其名字的前兩個字母 La）。',
    details: 'TeX 的操作非常底層，像是告訴排版機「移動游標多少公厘，放下這個字元」。而 LaTeX 引入了結構化的概念（如 \\section, \\begin{equation}），讓作者只需專注於「文檔結構」與「邏輯內容」，而將「排版樣式」完全交給系統。',
    funFact: 'Leslie Lamport 也是分散式系統領域的泰斗，曾獲得 2013 年圖靈獎（Turing Award）。他開玩笑說，自己因為 LaTeX 名揚天下，但大家卻常常忘記他在電腦科學理論上的偉大成就。'
  },
  {
    year: '1994',
    title: 'LaTeX2ε 發佈 ── 奠定現代標準',
    author: 'LaTeX3 專案小組',
    icon: BookOpen,
    summary: '為了解決當時市面上各種混亂、互不相容的 LaTeX 衍生版本，LaTeX 專案小組發佈了 LaTeX2ε 作為官方統一標準。',
    details: 'LaTeX2ε 引入了強大的套件套裝機制（\\usepackage），使全世界的學者能夠極其便利地分享自己開發的樣式與巨集。這奠定了 LaTeX 作為全球學術期刊、學位論文標準排版工具的地位。',
    funFact: '為什麼叫 2ε (2-epsilon) 而不是 3.0？因為 LaTeX 團隊認為這只是一個過渡版本，真正的 LaTeX3 還在開發中。但這個「過渡版本」卻穩定運行了三十話題年，至今仍是全世界排版的主力。'
  },
  {
    year: '2014',
    title: 'Overleaf 與雲端協作 ── 拋棄繁瑣的本地配置',
    author: 'John Hammersley & John Lees-Miller',
    icon: Share2,
    summary: '隨著 Web 技術的飛速發展，線上 LaTeX 編輯器 Overleaf 逐漸成為主流，解決了安裝 TeX Live 或 MacTeX 等數 GB 軟體包的煩惱。',
    details: 'Overleaf 讓學者們能夠在瀏覽器中直接撰寫 LaTeX，並且支援類似 Google Docs 的多人即時協作與即時編譯預覽。它極大地降低了初學者的入門門檻，並極大地加速了學術論文的合作撰寫流程。',
    funFact: '在 Overleaf 出現之前，多位作者合作寫論文往往需要用 Git 反覆同步，或者在郵件中互傳 `paper_v1_draft_final_final2.tex` 檔案，容易造成編譯衝突。雲端協作徹底終結了這個噩夢。'
  },
  {
    year: '現代',
    title: '多元編譯引擎與 LaTeX3 ── 支援現代字型與系統整合',
    author: '社群開發者',
    icon: Sparkles,
    summary: '隨著 XeTeX 與 LuaTeX 引擎的成熟，LaTeX 原生支援 UTF-8 編碼與作業系統安裝的 TrueType/OpenType 字型，中文排版不再是難題。',
    details: '傳統 LaTeX 排版中文需要極清繁瑣的字型配置。現代的 XeLaTeX 讓使用者只需使用 `\\usepackage{xeCJK}` 並指定系統中的「微軟正黑體」或「思源宋體」，即可完美印出中文。此外，LaTeX 也與 Markdown、Pandoc 等工具整合，可自動轉換生成。',
    funFact: 'LaTeX 已經成為很多科學分支（特別是數學、物理、資訊科學）唯一可接受的投稿格式。即使有新一代的標記語言（如 Typst）興起，LaTeX 龐大的生態與數十年的論文資料庫仍讓它地位不可動搖。'
  }
];

export default function HistoryTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="history-timeline-container">
      <div className="timeline-layout">
        {/* 左側：時間軸進度與節點 */}
        <div className="timeline-nav">
          <div className="timeline-line"></div>
          {timelineEvents.map((event, idx) => {
            const IconComponent = event.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={event.year}
                className={`timeline-node ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <div className="node-marker">
                  <IconComponent className="node-icon" size={16} />
                </div>
                <div className="node-label">
                  <span className="node-year">{event.year}</span>
                  <span className="node-title-short">{event.title.split(' ── ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 右側：詳細故事展示卡 */}
        <div className="timeline-content-card">
          <div className="card-header">
            <span className="card-year">{timelineEvents[activeIndex].year}</span>
            <h3 className="card-title">{timelineEvents[activeIndex].title}</h3>
            <p className="card-author">關鍵人物：<strong>{timelineEvents[activeIndex].author}</strong></p>
          </div>
          
          <div className="card-body">
            <p className="card-summary">{timelineEvents[activeIndex].summary}</p>
            <div className="card-divider"></div>
            <p className="card-details">{timelineEvents[activeIndex].details}</p>
            
            <div className="fun-fact-box">
              <div className="fun-fact-header">
                <Sparkles size={16} className="sparkle-icon" />
                <span>LaTeX 趣味冷知識</span>
              </div>
              <p className="fun-fact-text">{timelineEvents[activeIndex].funFact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
