import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';

// KaTeX 渲染輔助組件
export function Latexy({ math, block = false }) {
  const containerRef = (el) => {
    if (el && window.katex) {
      let cleanMath = math.trim();
      let isBlock = block;

      // 1. 去除行內公式定界符 $...$
      if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1);
      }
      // 2. 去除行外公式定界符 $$...$$
      else if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2);
        isBlock = true;
      }
      // 3. 去除行外公式定界符 \[...\]
      else if (cleanMath.startsWith('\\[') && cleanMath.endsWith('\\]')) {
        cleanMath = cleanMath.slice(2, -2);
        isBlock = true;
      }
      // 4. 去除 equation 環境以防編號與卡片寬度重疊
      else if (cleanMath.startsWith('\\begin{equation}') && cleanMath.endsWith('\\end{equation}')) {
        cleanMath = cleanMath.slice(16, -14);
        isBlock = true;
      }
      else if (cleanMath.startsWith('\\begin{equation*}') && cleanMath.endsWith('\\end{equation*}')) {
        cleanMath = cleanMath.slice(17, -15);
        isBlock = true;
      }

      try {
        window.katex.render(cleanMath, el, {
          displayMode: isBlock,
          throwOnError: false,
        });
      } catch {
        el.textContent = math;
      }
    } else if (el) {
      el.textContent = math;
    }
  };

  // 當 math 改變時，利用 React key 強制重渲染
  return <span ref={containerRef} key={math} className="katex-rendered-inline" />;
}

const categories = [
  {
    id: 'structure',
    name: '文件結構與版面',
    items: [
      { name: '文件類型定義', code: '\\documentclass[12pt]{article}', renderMath: false, desc: '聲明文檔類型（如 article, report, book），中括號內可選字型大小。' },
      { name: '導入功能套件', code: '\\usepackage{graphicx}\n\\usepackage{amsmath}', renderMath: false, desc: '在導言區載入第三方套件（如插圖、高階數學包）。' },
      { name: '文檔主體環境', code: '\\begin{document}\nHello LaTeX!\n\\end{document}', renderMath: false, desc: '所有要輸出列印的正文內容必須寫在 document 環境內。' },
      { name: '製作標題資訊', code: '\\title{我的論文}\n\\author{張三}\n\\date{\\today}\n\\maketitle', renderMath: false, desc: '定義標題、作者與日期，並用 \\maketitle 在頁首生成排版。' },
      { name: '自動生成目錄', code: '\\tableofcontents', renderMath: false, desc: '自動收集文檔中的 \\section 等標題，並生成帶頁碼的目錄。' },
      { name: '強制換頁', code: '\\newpage', renderMath: false, desc: '強制在此處將後續內容移至下一頁。' },
      { name: '垂直間距', code: '\\vspace{15pt}', renderMath: false, desc: '插入指定大小的垂直空白（支援 pt, cm, mm, em 等單位）。' },
      { name: '水平間距', code: '\\hspace{1cm}', renderMath: false, desc: '插入指定大小的水平空白。' },
      { name: '頁面邊距設定', code: '\\usepackage[margin=1in]{geometry}', renderMath: false, desc: '置於導言區，將文件上下左右邊距全部設定為 1 英吋。' },
      { name: '插入腳註', code: '這是一段正文\\footnote{這是顯示在頁底的腳註。}', renderMath: false, desc: '在文字右上方添加編號，並在該頁底部生成說明腳註。' }
    ]
  },
  {
    id: 'formatting',
    name: '文字格式與字型',
    items: [
      { name: '粗體字 (Bold)', code: '\\textbf{粗體文字}', renderMath: false, desc: '將括號內的文字設定為粗體。' },
      { name: '斜體字 (Italic)', code: '\\textit{斜體文字}', renderMath: false, desc: '將文字變更為義大利斜體字。' },
      { name: '等寬字 (Monospace)', code: '\\texttt{code_style}', renderMath: false, desc: '常用於展示程式碼、變數名或網址。' },
      { name: '小型大寫字母', code: '\\textsc{Small Caps}', renderMath: false, desc: '將英文小寫字母排版為較小尺寸的大寫樣式。' },
      { name: '加底線 (Underline)', code: '\\underline{強調文字}', renderMath: false, desc: '為文字下方添加一條底線。' },
      { name: '微型文字', code: '{\\tiny 微型字}', renderMath: false, desc: 'LaTeX 中最小的字型大小等級。' },
      { name: '小型文字', code: '{\\small 小號字}', renderMath: false, desc: '常用於備註、副標題或腳註。' },
      { name: '放大文字', code: '{\\large 大號字}', renderMath: false, desc: '比正常正文字型稍大。' },
      { name: '極大字型 (Huge)', code: '{\\Huge 極大字}', renderMath: false, desc: 'LaTeX 中最大的字型大小，常用於大標題。' },
      { name: '區塊置中對齊', code: '\\begin{center}\n置中文字...\n\\end{center}', renderMath: false, desc: '將包裹在內的所有段落與內容進行水平置中排版。' },
      { name: '文字顏色', code: '\\textcolor{red}{紅色文字}', renderMath: false, desc: '變更文字顏色（需在導言區引入 \\usepackage{xcolor}）。' }
    ]
  },
  {
    id: 'lists-tables',
    name: '列表與表格',
    items: [
      { name: '無序列表 (Bullet)', code: '\\begin{itemize}\n  \\item 第一項\n  \\item 第二項\n\\end{itemize}', renderMath: false, desc: '生成以圓點符號開頭的條列式項目。' },
      { name: '有序列表 (Numbered)', code: '\\begin{enumerate}\n  \\item 第一步\n  \\item 第二步\n\\end{enumerate}', renderMath: false, desc: '自動以 1, 2, 3... 數字進行編號的項目列表。' },
      { name: '描述列表 (Description)', code: '\\begin{description}\n  \\item[TeX] 基礎排版引擎\n  \\item[LaTeX] 高階巨集套件\n\\end{description}', renderMath: false, desc: '用粗體黑字標記每個條目的專有名詞定義列表。' },
      { name: '基礎表格 (Tabular)', code: '\\begin{tabular}{|l|c|r|}\n  \\hline\n  靠左 & 置中 & 靠右 \\\\\n  \\hline\n  A & B & C \\\\\n  \\hline\n\\end{tabular}', renderMath: false, desc: '表格環境：|l|c|r| 代表三欄且有垂直邊線，& 分欄，\\\\ 換行，\\hline 畫水平線。' },
      { name: '浮動表格環境 (Table)', code: '\\begin{table}[h]\n  \\centering\n  \\begin{tabular}{cc}\n    A & B\n  \\end{tabular}\n  \\caption{表格說明}\n  \\label{tab:data}\n\\end{table}', renderMath: false, desc: '包裝表格的浮動容器，能加上編號說明標題 (\\caption) 並支援交叉參照 (\\label)。' }
    ]
  },
  {
    id: 'math-basic',
    name: '數學公式基礎',
    items: [
      { name: '行內公式 (Inline)', code: '$E = mc^2$', renderMath: true, desc: '使用單個金錢符號包裹，公式會嵌入在段落文字中。' },
      { name: '獨立區塊公式', code: '\\[ \\int f(x) dx \\]', renderMath: true, desc: '使用 \\[ \\] 包裹，公式會單獨成行並水平置中。' },
      { name: '有編號的等式環境', code: '\\begin{equation}\na^2 + b^2 = c^2\n\\end{equation}', renderMath: true, desc: '自動在公式右側添加章節編號，便於後文參照。' },
      { name: '基礎分數', code: '\\frac{a}{b}', renderMath: true, desc: '第一個大括號為分子，第二個大括號為分母。' },
      { name: '上下標組合', code: 'x_{i}^{n}', renderMath: true, desc: '底線 _ 緊跟下標內容，插入符 ^ 緊跟上標內容。多字元須用大括號。' },
      { name: '平方根', code: '\\sqrt{x}', renderMath: true, desc: '繪製標準的平方根符號。' },
      { name: 'n 次方根', code: '\\sqrt[n]{x}', renderMath: true, desc: '中括號內填寫開根號次數。' },
      { name: '極限表示法', code: '\\lim_{x \\to \\infty} \\frac{1}{x}', renderMath: true, desc: '\\to 代表箭頭，_ 下標標示趨近條件。' },
      { name: '累加求和', code: '\\sum_{i=1}^{n} a_i', renderMath: true, desc: '求和符號，行間模式下上下限會自動置於符號的上下方。' },
      { name: '單重積分', code: '\\int_{a}^{b} f(x) dx', renderMath: true, desc: '積分符號，上下標分別標示積分上下限。' },
      { name: '多重積分', code: '\\iint_{D} dx dy', renderMath: true, desc: '雙重積分符號（三重積分使用 \\iiint）。' },
      { name: '偏微分表示', code: '\\frac{\\partial y}{\\partial x}', renderMath: true, desc: '使用 \\partial 符號繪製偏微分算子。' }
    ]
  },
  {
    id: 'math-symbols',
    name: '數學符號大全',
    items: [
      { name: '希臘小寫字母', code: '\\alpha, \\beta, \\gamma, \\theta, \\lambda, \\pi, \\sigma, \\omega, \\phi', renderMath: true, desc: '科學計算中最常用的希臘小寫字母。' },
      { name: '希臘大寫字母', code: '\\Gamma, \\Delta, \\Theta, \\Lambda, \\Pi, \\Sigma, \\Omega, \\Phi', renderMath: true, desc: '希臘大寫字母（通常與對應英文字母不同形者）。' },
      { name: '基礎算子', code: '\\pm, \\times, \\div, \\cdot, \\mp, \\ast, \\star', renderMath: true, desc: '加減、乘、除、點乘、減加、星號等運算子。' },
      { name: '關係運算子', code: '\\le, \\ge, \\neq, \\approx, \\equiv, \\propto, \\sim', renderMath: true, desc: '小於等於、大於等於、不等於、約等於、恆等於、正比於、相似於。' },
      { name: '箭頭符號', code: '\\to, \\gets, \\implies, \\iff, \\uparrow, \\downarrow, \\leftrightarrow', renderMath: true, desc: '指向箭頭、雙向箭頭、推導出、若且唯若、上下箭頭。' },
      { name: '集合與邏輯', code: '\\forall, \\exists, \\in, \\notin, \\subset, \\subseteq, \\cup, \\cap, \\emptyset, \\infty', renderMath: true, desc: '任意、存在、屬於、不屬於、子集、聯集、交集、空集、無限大。' },
      { name: '三角函數與對數', code: '\\sin\\theta, \\cos\\theta, \\tan\\theta, \\log_a b, \\ln x', renderMath: true, desc: '直立的正弦、餘弦、正切、對數符號，防止被排版為變數斜體。' }
    ]
  },
  {
    id: 'advanced-math',
    name: '矩陣與公式排版',
    items: [
      { name: '小括號矩陣 (pmatrix)', code: '\\begin{pmatrix}\na & b \\\\\nc & d\n\\end{pmatrix}', renderMath: true, desc: '最常見的帶圓括號的矩陣排版。' },
      { name: '中括號矩陣 (bmatrix)', code: '\\begin{bmatrix}\na & b \\\\\nc & d\n\\end{bmatrix}', renderMath: true, desc: '帶方括號的矩陣排版。' },
      { name: '行列式 (vmatrix)', code: '\\begin{vmatrix}\na & b \\\\\nc & d\n\\end{vmatrix}', renderMath: true, desc: '兩旁為垂直單線的行列式排版。' },
      { name: '多行公式對齊 (align)', code: '\\begin{aligned}\n  (x+y)^2 &= x^2 + 2xy + y^2 \\\\\n  (x-y)^2 &= x^2 - 2xy + y^2\n\\end{aligned}', renderMath: true, desc: '在 & 符號處垂直對齊（如等號），\\\\ 用於換行。' },
      { name: '條件函數 (cases)', code: 'f(x) = \\begin{cases}\n  1, & x > 0 \\\\\n  0, & x = 0 \\\\\n  -1, & x < 0\n\\end{cases}', renderMath: true, desc: '繪製左側帶有大括號的多條件定義函數。' },
      { name: '自動縮放括號', code: '\\left( \\frac{1}{1 - x^2} \\right)', renderMath: true, desc: '使用 \\left 和 \\right 能讓括號的高度自動適應包裹的公式高度。' }
    ]
  },
  {
    id: 'media-ref',
    name: '插圖與交叉參照',
    items: [
      { name: '插入外部圖片', code: '\\includegraphics[width=0.8\\textwidth]{chart.png}', renderMath: false, desc: '插入圖片，可指定寬度為版面寬度的 80%（需引進 graphicx 包）。' },
      { name: '圖片浮動環境 (Figure)', code: '\\begin{figure}[htbp]\n  \\centering\n  \\includegraphics[width=0.5\\textwidth]{logo.png}\n  \\caption{標誌說明}\n  \\label{fig:logo}\n\\end{figure}', renderMath: false, desc: '圖片標準包裹容器。[htbp] 為位置建議參數，\\label 用於引文參照。' },
      { name: '定義標籤與引用', code: '\\section{導論} \\label{sec:intro}\n請參見第 \\ref{sec:intro} 節。', renderMath: false, desc: '使用 \\label 標記章節、公式或圖表，再以 \\ref 動態輸出其對應的自動編號。' },
      { name: '文獻引用', code: '如文獻 \\cite{author2026} 所述。', renderMath: false, desc: '在正文中引用參考文獻（搭配 BibTeX 或 bibliography 列表）。' },
      { name: '手工文獻列表', code: '\\begin{thebibliography}{9}\n  \\bibitem{author2026} 姓名. 論文題目. 期刊名, 2026.\n\\end{thebibliography}', renderMath: false, desc: '在文檔末尾手動編排的簡單參考文獻清單。' }
    ]
  }
];

export default function CheatSheet() {
  const [activeTab, setActiveTab] = useState('structure');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(`${activeTab}-${index}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  return (
    <div className="cheat-sheet-container">
      {/* 分類切換按鈕 */}
      <div className="cheat-sheet-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cheat-sheet-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 語法卡片網格 */}
      <div className="cheat-sheet-grid">
        {activeCategory.items.map((item, idx) => {
          const uniqueId = `${activeTab}-${idx}`;
          const isCopied = copiedId === uniqueId;
          return (
            <div key={idx} className="cheat-sheet-card">
              <div className="card-header">
                <h4>{item.name}</h4>
                <button
                  className={`copy-btn ${isCopied ? 'copied' : ''}`}
                  onClick={() => handleCopy(item.code, idx)}
                  title="點擊複製程式碼"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? '已複製' : '複製'}</span>
                </button>
              </div>

              <div className="card-body">
                {/* 如果需要渲染 LaTeX，則展示渲染後的數學公式 */}
                {item.renderMath ? (
                  <div className="math-preview-container">
                    <Latexy math={item.code} block={true} />
                  </div>
                ) : null}

                {/* 原始程式碼區 */}
                <pre className="code-block">
                  <code>{item.code}</code>
                </pre>
              </div>

              <div className="card-footer">
                <Info size={12} className="info-icon" />
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
