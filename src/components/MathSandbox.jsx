import { useState, useRef } from 'react';
import { Latexy } from './CheatSheet';
import { HelpCircle, Code, Settings, Copy, Check } from 'lucide-react';

const templates = [
  {
    name: '薛丁格方程式 (量子力學)',
    code: 'i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right]\\Psi(\\mathbf{r},t)'
  },
  {
    name: '傅立葉變換 (訊號處理)',
    code: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} dx'
  },
  {
    name: '愛因斯坦場方程式 (廣義相對論)',
    code: 'R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}'
  },
  {
    name: '常態分佈機率密度 (統計學)',
    code: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}'
  },
  {
    name: '尤拉恆等式 (最美數學公式)',
    code: 'e^{i\\pi} + 1 = 0'
  },
  {
    name: '麥克斯韋方程組 (電磁學)',
    code: '\\begin{aligned}\n  \\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\\n  \\nabla \\cdot \\mathbf{B} &= 0 \\\\\n  \\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\\n  \\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}\n\\end{aligned}'
  }
];

const quickInserts = [
  { label: '分數', code: '\\frac{a}{b}' },
  { label: '根號', code: '\\sqrt{x}' },
  { label: '積分', code: '\\int_{a}^{b} f(x) dx' },
  { label: '加總', code: '\\sum_{i=1}^{n}' },
  { label: '極限', code: '\\lim_{x \\to \\infty}' },
  { label: '偏微分', code: '\\frac{\\partial y}{\\partial x}' },
  { label: '小括號矩陣', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: '希臘字母 α', code: '\\alpha' },
  { label: '希臘字母 β', code: '\\beta' },
  { label: '希臘字母 θ', code: '\\theta' },
  { label: '無限大', code: '\\infty' },
  { label: '梯度 ∇', code: '\\nabla' }
];

export default function MathSandbox() {
  const [inputCode, setInputCode] = useState(templates[0].code);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const insertCode = (codeToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newValue = before + codeToInsert + after;

    setInputCode(newValue);

    // 重新聚焦並設定游標位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + codeToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="math-sandbox-container">

      <div className="sandbox-workspace">
        {/* 左側：編輯器面板 */}
        <div className="sandbox-panel editor-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Code size={16} />
              <h3>LaTeX 原始碼編輯區</h3>
            </div>
            <div className="panel-actions">
              <button 
                className={`panel-action-btn copy-code-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="複製此段 LaTeX 程式碼"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '已複製' : '複製程式碼'}</span>
              </button>
            </div>
          </div>

          {/* 快速插入工具欄 */}
          <div className="quick-insert-toolbar">
            {quickInserts.map((item, idx) => (
              <button
                key={idx}
                className="quick-insert-btn"
                onClick={() => insertCode(item.code)}
                title={`插入 ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="在此輸入 LaTeX 數學公式程式碼，例如: \sum_{i=1}^n i = \frac{n(n+1)}{2}"
              className="sandbox-textarea"
              spellCheck="false"
            />
          </div>
          
          <div className="editor-tips">
            <HelpCircle size={12} />
            <span>提示：輸入時不需要加上行外 `$$` 或行內 `$ `，沙盒預設以「獨立區塊 (Block) 模式」進行排版。</span>
          </div>
        </div>

        {/* 右側：即時渲染面板 */}
        <div className="sandbox-panel preview-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Settings size={16} className="spinning-icon-hover" />
              <h3>即時渲染預覽區 (KaTeX)</h3>
            </div>
          </div>

          <div className="preview-display">
            <div className="rendered-output">
              {inputCode.trim() ? (
                <Latexy math={inputCode} block={true} />
              ) : (
                <span className="placeholder-text">等待輸入公式...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
