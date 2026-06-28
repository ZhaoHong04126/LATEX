import { useState, useEffect } from 'react';
import { Sun, Moon, Info, ArrowUpRight, CheckCircle, Code, GraduationCap, History, BookOpen } from 'lucide-react';
import HistoryTimeline from './components/HistoryTimeline';
import CheatSheet, { Latexy } from './components/CheatSheet';
import MathSandbox from './components/MathSandbox';

const typingFormulas = [
  { name: 'Basel Problem', code: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
  { name: "Euler's Identity", code: 'e^{i\\pi} + 1 = 0' },
  { name: 'Schrödinger Eq.', code: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const [wordVsLatexTab, setWordVsLatexTab] = useState('latex');

  // Typing Effect States
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 衍生狀態：當打完公式時，即時渲染
  const currentFormula = typingFormulas[typingIndex];
  const showRendered = typedText === currentFormula.code;

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash || '#/';
      // 容錯處理：如果輸入無斜線的 hash（例如 #sandbox），自動標準化為 #/sandbox
      if (hash.startsWith('#') && !hash.startsWith('#/')) {
        hash = '#/' + hash.slice(1);
        window.location.hash = hash; // 同步更新瀏覽器網址列的 Hash
        return;
      }
      setCurrentRoute(hash);
      window.scrollTo(0, 0); // 切換頁面時自動回到最上方
    };
    window.addEventListener('hashchange', handleHashChange);
    // 初始化確認一次
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Typing effect animation
  useEffect(() => {
    const fullCode = currentFormula.code;
    let timer;

    if (isDeleting) {
      if (typedText === '') {
        // 刪除完成：改用非同步計時器切換狀態，防止觸發同步 cascading renders 警告
        timer = setTimeout(() => {
          setIsDeleting(false);
          setTypingIndex(prev => (prev + 1) % typingFormulas.length);
        }, 0);
      } else {
        // 繼續刪除
        timer = setTimeout(() => {
          setTypedText(prev => prev.slice(0, -1));
        }, 30);
      }
    } else {
      if (typedText === fullCode) {
        // 輸入完成：停留 3.5 秒後開始刪除
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 3500);
      } else {
        // 繼續輸入
        timer = setTimeout(() => {
          setTypedText(prev => fullCode.slice(0, prev.length + 1));
        }, 80);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentFormula]);

  // 1. 首頁 (Home) 視圖
  const renderHome = () => (
    <div className="route-page-fade">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-info">
            <h1>
              用數學般精準的語言，<br />
              撰寫 <span className="highlight">完美的排版藝術</span>
            </h1>
            <p className="hero-desc">
              LaTeX 是一個高質量的排版系統，專為處理複雜的數學公式與結構化文檔而生。在這裡，你可以探索其由來、掌握核心語法，並在免安裝的沙盒中即時揮灑你的公式靈感。
            </p>
            <div className="hero-cta">
              <a href="#/sandbox" className="btn btn-primary">
                <Code size={16} />
                進入即時公式沙盒
              </a>
              <a href="#/what-is" className="btn btn-secondary">
                了解 LaTeX 優勢
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-console">
              <div className="console-header">
                <div className="console-dots">
                  <span className="console-dot red"></span>
                  <span className="console-dot yellow"></span>
                  <span className="console-dot green"></span>
                </div>
                <div className="console-title">basel_problem.tex - PDF Live Compile</div>
              </div>
              <div className="console-body">
                <div className="console-line">
                  <span className="console-prompt">&gt;</span>
                  <span>{typedText}</span>
                  <span className="console-cursor"></span>
                </div>
                <div className="console-divider"></div>
                <div className="console-output-preview">
                  {showRendered ? (
                    <Latexy math={typingFormulas[typingIndex].code} block={true} />
                  ) : (
                    <span className="console-title">Compiling LaTeX document...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 首頁導覽入口網格 */}
      <section className="section-container" style={{paddingTop: '4rem', paddingBottom: '5rem'}}>
        <div className="section-header" style={{marginBottom: '2.5rem'}}>
          <h2 className="section-title">探索 LaTeX 核心主題</h2>
          <p className="section-subtitle">點擊下方卡片即可直接切換至不同功能分頁，開始您的 LaTeX 排版學習旅程。</p>
        </div>
        <div className="intro-features" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem'}}>
          <a href="#/what-is" className="feature-box" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
            <div className="feature-icon-wrapper" style={{marginBottom: '1rem'}}><Info size={28} /></div>
            <h4 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem'}}>何謂 LaTeX？</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>了解內容與格式分離的 WYSIWYM 設計哲學，以及與傳統 MS Word 的對比。</p>
            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)'}}>
              閱讀文章 <ArrowUpRight size={14} style={{marginLeft: '2px'}} />
            </div>
          </a>

          <a href="#/history" className="feature-box" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
            <div className="feature-icon-wrapper" style={{marginBottom: '1rem'}}><History size={28} /></div>
            <h4 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem'}}>發展歷史</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>追溯 TeX 到 LaTeX3 歷經半個世紀的演進，探索 Knuth 等傳奇大師的開發故事。</p>
            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)'}}>
              查看時間軸 <ArrowUpRight size={14} style={{marginLeft: '2px'}} />
            </div>
          </a>

          <a href="#/cheat-sheet" className="feature-box" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
            <div className="feature-icon-wrapper" style={{marginBottom: '1rem'}}><BookOpen size={28} /></div>
            <h4 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem'}}>語法速查</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>收錄七大核心排版與數學公式語法，支援 LaTeX 與 KaTeX 渲染效果，點擊即複製。</p>
            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)'}}>
              前往速查表 <ArrowUpRight size={14} style={{marginLeft: '2px'}} />
            </div>
          </a>

          <a href="#/learning" className="feature-box" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
            <div className="feature-icon-wrapper" style={{marginBottom: '1rem'}}><GraduationCap size={28} /></div>
            <h4 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem'}}>學習資源</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>規劃三步零基礎入門指南，並提供線上編輯器與本地編譯環境套件下載連結。</p>
            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)'}}>
              開始學習 <ArrowUpRight size={14} style={{marginLeft: '2px'}} />
            </div>
          </a>

          <a href="#/sandbox" className="feature-box" style={{display: 'block', textDecoration: 'none', color: 'inherit'}}>
            <div className="feature-icon-wrapper" style={{marginBottom: '1rem'}}><Code size={28} /></div>
            <h4 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem'}}>即時公式沙盒</h4>
            <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>免安裝環境，直接在瀏覽器中撰寫 LaTeX 代碼並即時在網頁中編譯渲染公式。</p>
            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)'}}>
              開啟沙盒 <ArrowUpRight size={14} style={{marginLeft: '2px'}} />
            </div>
          </a>
        </div>
      </section>
    </div>
  );

  // 2. 何謂 LaTeX (WhatIs) 視圖
  const renderWhatIs = () => (
    <div className="route-page-fade section-container">
      <div className="section-header">
        <h2 className="section-title">何謂 LaTeX？</h2>
        <p className="section-subtitle">
          不同於 Word 的「所見即所得」(WYSIWYG)，LaTeX 採用「所想即所得」(WYSIWYM) 的文字標記哲學。
        </p>
      </div>

      <div className="what-is-grid">
        <div className="intro-text">
          <p>
            <strong>LaTeX</strong>（讀音為 /ˈlɑːtɛk/ 或 /ˈleɪtɛk/）是由美國電腦科學家 Leslie Lamport 在 1980 年代初期基於 Donald Knuth 的 TeX 排版引擎開發的巨集套件。
          </p>
          <p>
            它的核心哲學是將<strong>「內容撰寫」與「排版格式」完全分離</strong>。在撰寫時，你不需要手動點擊滑鼠去調整字型大小或邊距；相反地，你使用如 <code>{"\\section{標題}"}</code> 等標記指令來標識結構，排版系統會自動按照精細的學術規範替你完成所有美化工作。
          </p>
          
          <div className="intro-features">
            <div className="feature-box">
              <div className="feature-icon-wrapper"><CheckCircle size={20} /></div>
              <h4>無與倫比的數學排版</h4>
              <p>公認最優美的數學公式排版效果，幾乎是全球學術界、頂級期刊的唯一標準。</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon-wrapper"><CheckCircle size={20} /></div>
              <h4>自動引文與交叉引用</h4>
              <p>強大的 BibTeX 自動處理參考文獻，數百頁的章節與公式編號自動對齊，絕不出錯。</p>
            </div>
          </div>
        </div>

        {/* Word vs LaTeX 對比卡 */}
        <div className="comparison-card">
          <div className="comparison-header">
            <h3>微軟 Word vs LaTeX</h3>
            <div className="comparison-toggle">
              <button 
                className={`toggle-btn ${wordVsLatexTab === 'word' ? 'active' : ''}`}
                onClick={() => setWordVsLatexTab('word')}
              >
                MS Word
              </button>
              <button 
                className={`toggle-btn ${wordVsLatexTab === 'latex' ? 'active' : ''}`}
                onClick={() => setWordVsLatexTab('latex')}
              >
                LaTeX
              </button>
            </div>
          </div>

          <div className="comparison-content">
            {wordVsLatexTab === 'word' ? (
              <div className="comparison-side">
                <div className="side-title-wrapper">
                  <h4>所見即所得 (WYSIWYG)</h4>
                  <span className="side-badge word">視覺導向</span>
                </div>
                <ul>
                  <li>手動點選按鈕調整粗體、斜體與字型，編輯直觀。</li>
                  <li>當文檔長度達數十頁或包含大量公式時，極易發生「版面跑掉」的情況。</li>
                  <li>公式編輯器輸入效率低，且排版美感略顯不足。</li>
                  <li>不適合與 Git 等版本控制系統協同合作，無法看到純文字的行級變更差異。</li>
                </ul>
              </div>
            ) : (
              <div className="comparison-side">
                <div className="side-title-wrapper">
                  <h4>所想即所得 (WYSIWYM)</h4>
                  <span className="side-badge latex">結構與邏輯導向</span>
                </div>
                <ul>
                  <li>內容純文字編寫，利用標籤定義結構，免受滑鼠選單調整格式的分心。</li>
                  <li>排版引擎保證在第 1 頁與第 1000 頁的格式高度統一，完全符合出版標準。</li>
                  <li>純文字鍵盤快速鍵輸入公式（如 <code>{"\\frac{a}{b}"}</code>），速度驚人且視覺完美。</li>
                  <li>純文字檔案天然契合 Git 版本控制系統，便於追蹤論文版本變更。</li>
                </ul>
              </div>
            )}
          </div>
          <div className="comparison-footer">
            <Info size={12} style={{marginRight: '6px', verticalAlign: 'middle', display:'inline-block'}} />
            <span>結論：Word 適合簡短、樣式隨意的文書；LaTeX 則是學術論文、科技報告與圖書出版的最佳方案。</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. 發展歷史 (History) 視圖
  const renderHistory = () => (
    <div className="route-page-fade section-container">
      <div className="section-header">
        <h2 className="section-title">LaTeX 演進歷史</h2>
        <p className="section-subtitle">
          探尋 TeX 到 LaTeX3 的演變足跡，以及電腦排版技術演進史上的關鍵時刻。
        </p>
      </div>
      <HistoryTimeline />
    </div>
  );

  // 4. 語法速查 (CheatSheet) 視圖
  const renderCheatSheet = () => (
    <div className="route-page-fade section-container">
      <div className="section-header">
        <h2 className="section-title">LaTeX 語法速查大全</h2>
        <p className="section-subtitle">
          按分類彙整最常用且極具代表性的 LaTeX 排版語法與數學符號，點擊卡片即可快速複製。
        </p>
      </div>
      <CheatSheet />
    </div>
  );

  // 5. 學習資源 (Learning) 視圖
  const renderLearning = () => (
    <div className="route-page-fade section-container">
      <div className="section-header">
        <h2 className="section-title">學習路徑與軟體資源</h2>
        <p className="section-subtitle">
          只要掌握正確觀念，LaTeX 並不難學。這裡為您規劃了入門指南，並整理了編輯器與編譯包下載連結。
        </p>
      </div>

      <div className="learning-guide-grid">
        <div className="learning-path">
          <h3>三步零基礎入門 LaTeX</h3>
          <div className="path-steps">
            <div className="path-step">
              <div className="step-num">1</div>
              <div className="step-content">
                <h4>註冊線上編輯器 Overleaf</h4>
                <p>初學者強烈建議使用雲端編輯器 <a href="https://www.overleaf.com" target="_blank" rel="noreferrer">Overleaf <ArrowUpRight size={12} style={{display:'inline'}} /></a>。它不需要您在電腦安裝繁重的 LaTeX 編譯包，直接開箱即可在瀏覽器內合作編寫。</p>
              </div>
            </div>
            <div className="path-step">
              <div className="step-num">2</div>
              <div className="step-content">
                <h4>掌握文檔基本結構</h4>
                <p>了解 LaTeX 的文檔包含兩個部分：<code>導言區 (Preamble)</code> 用於聲明巨集包與設置樣式，<code>正文區 (Document)</code> 包裹在 <code>{"\\begin{document}"}</code> 內，撰寫主要文字內容。</p>
              </div>
            </div>
            <div className="path-step">
              <div className="step-num">3</div>
              <div className="step-content">
                <h4>在沙盒中練習公式與複製速查指令</h4>
                <p>利用我們提供的 <a href="#/sandbox">即時公式沙盒</a> 以及 <a href="#/cheat-sheet">語法速查表</a>，點擊複製所需的指令，並在沙盒中實際修改運行，能大幅加速您的熟悉度。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tools-resources">
          <h3>推薦工具與延伸閱讀</h3>
          <div className="resource-cards-list">
            <div className="resource-card-mini">
              <div className="res-info">
                <h4>TeX Live (Windows/Linux)</h4>
                <p>最完整的本地 LaTeX 發行版編譯環境。</p>
              </div>
              <a href="https://tug.org/texlive/" target="_blank" rel="noreferrer" className="res-link">
                前往官網
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="resource-card-mini">
              <div className="res-info">
                <h4>MacTeX (macOS)</h4>
                <p>專為 macOS 優化整合的 TeX 完整安裝包。</p>
              </div>
              <a href="https://tug.org/mactex/" target="_blank" rel="noreferrer" className="res-link">
                前往官網
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="resource-card-mini">
              <div className="res-info">
                <h4>Detexify (符號手寫辨識)</h4>
                <p>用滑鼠手畫數學符號，自動查詢 LaTeX 代碼。</p>
              </div>
              <a href="https://detexify.kirelabs.org/" target="_blank" rel="noreferrer" className="res-link">
                開始辨識
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 6. 即時沙盒 (Sandbox) 視圖
  const renderSandbox = () => (
    <div className="route-page-fade sandbox-page-container">
      <div className="section-header">
        <h2 className="section-title">LaTeX 即時公式沙盒</h2>
        <p className="section-subtitle">
          在左側自由編輯，或點擊頂部範本與快速插入按鈕，右側會立刻利用 KaTeX 引擎為您渲染數學公式。
        </p>
      </div>
      <MathSandbox />
    </div>
  );

  // 路由分發
  const renderContent = () => {
    switch (currentRoute) {
      case '#/what-is':
        return renderWhatIs();
      case '#/history':
        return renderHistory();
      case '#/cheat-sheet':
        return renderCheatSheet();
      case '#/learning':
        return renderLearning();
      case '#/sandbox':
        return renderSandbox();
      case '#/':
      default:
        return renderHome();
    }
  };

  return (
    <div className="app-container">
      {/* 導覽列 */}
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#/" className="nav-brand">
            <span className="latex-logo">
              <span className="L">L</span>
              <span className="A">a</span>
              <span className="T">T</span>
              <span className="E">e</span>
              <span className="X">X</span>
            </span>
            <span>資源網</span>
          </a>

          <div className="nav-links">
            <a href="#/what-is" className={`nav-link ${currentRoute === '#/what-is' ? 'active' : ''}`}>何謂 LaTeX</a>
            <a href="#/history" className={`nav-link ${currentRoute === '#/history' ? 'active' : ''}`}>發展歷史</a>
            <a href="#/cheat-sheet" className={`nav-link ${currentRoute === '#/cheat-sheet' ? 'active' : ''}`}>語法速查</a>
            <a href="#/learning" className={`nav-link ${currentRoute === '#/learning' ? 'active' : ''}`}>學習資源</a>
            <a href="#/sandbox" className={`nav-link ${currentRoute === '#/sandbox' ? 'active' : ''}`}>即時沙盒</a>
            <button 
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? '切換為淺色模式' : '切換為深色模式'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* 主要內容 (key 觸發 CSS 漸入效果) */}
      <main className="main-content" key={currentRoute}>
        {renderContent()}
      </main>

      {/* 頁尾 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="latex-logo">
              <span className="L">L</span>
              <span className="A">a</span>
              <span className="T">T</span>
              <span className="E">e</span>
              <span className="X">X</span>
            </span>
            <span>資源網 ── 完美的排版藝術與科學</span>
          </div>
          <p className="footer-text">
            © {new Date().getFullYear()} LaTeX 資源網. 本專案基於 React、Vite、Vanilla CSS 與 KaTeX 建置。
          </p>
        </div>
      </footer>
    </div>
  );
}
