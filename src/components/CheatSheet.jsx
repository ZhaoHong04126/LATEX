import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { latexCategoryItems } from '../data/latexCommands';

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
  { id: 'binary-op', name: '1. 二元運算號', items: latexCategoryItems['binary-op'] || [] },
  { id: 'relations', name: '2. 二元關係符號', items: latexCategoryItems['relations'] || [] },
  { id: 'logic', name: '3. 邏輯符號', items: latexCategoryItems['logic'] || [] },
  { id: 'sub-superscript', name: '4. 上標、下標及Head', items: latexCategoryItems['sub-superscript'] || [] },
  { id: 'large-operators', name: '5. 大尺寸運算符號', items: latexCategoryItems['large-operators'] || [] },
  { id: 'functions', name: '6. 標準函式符號', items: latexCategoryItems['functions'] || [] },
  { id: 'roots-fractions', name: '7. 根號與分數', items: latexCategoryItems['roots-fractions'] || [] },
  { id: 'calculus', name: '8. 微積分符號', items: latexCategoryItems['calculus'] || [] },
  { id: 'binomial', name: '9. 二項式係數', items: latexCategoryItems['binomial'] || [] },
  { id: 'arrows', name: '10. 箭號', items: latexCategoryItems['arrows'] || [] },
  { id: 'delimiters', name: '11. 分隔符號', items: latexCategoryItems['delimiters'] || [] },
  { id: 'greek-letters-title', name: '12. 希臘文字', isHeaderOnly: true },
  { id: 'greek-letters-upper', name: '12.1 大寫', items: latexCategoryItems['greek-letters-upper'] || [], isSubItem: true },
  { id: 'greek-letters-lower', name: '12.2 小寫', items: latexCategoryItems['greek-letters-lower'] || [], isSubItem: true },
  { id: 'arrays-equations', name: '13. 陣列與方程式', items: latexCategoryItems['arrays-equations'] || [] },
  { id: 'spaces', name: '14. 空格', items: latexCategoryItems['spaces'] || [] },
  { id: 'fonts', name: '15. 書寫時，英文字體顯示', items: latexCategoryItems['fonts'] || [] },
  { id: 'alignments', name: '16. 公式對齊', items: latexCategoryItems['alignments'] || [] }
];

export default function CheatSheet() {
  const [activeTab, setActiveTab] = useState('binary-op');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(`${activeTab}-${index}`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const activeCategory = categories.find((cat) => cat.id === activeTab);

  return (
    <div className="cheat-sheet-layout">
      {/* 左側邊欄：分類導覽 */}
      <aside className="cheat-sheet-sidebar">
        <h3 className="sidebar-title">速查分類</h3>
        <div className="cheat-sheet-tabs">
          {categories.map((cat) => {
            if (cat.isHeaderOnly) {
              return (
                <div key={cat.id} className="sidebar-group-header">
                  {cat.name}
                </div>
              );
            }
            return (
              <button
                key={cat.id}
                className={`cheat-sheet-tab-btn ${cat.isSubItem ? 'sub-item' : ''} ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 右側主要內容區 */}
      <main className="cheat-sheet-main">
        <div className="cheat-sheet-header">
          <h2 className="cheat-sheet-title">{activeCategory.name}</h2>
          <p className="cheat-sheet-subtitle">
            按分類彙整最常用且極具代表性的 LaTeX 排版語法與數學符號，點擊卡片即可快速複製。
          </p>
          {activeTab === 'relations' && (
            <div className="category-tip-box" style={{marginTop: '0.8rem', padding: '0.6rem 1rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '0 8px 8px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
              <span>💡 <strong>提示：</strong>可在關係符號前面加上 <code>\not</code> 得到其否定形式，例如：<code>\not &lt;</code> 可得到 <Latexy math="\not <" />（即 ≮）。</span>
            </div>
          )}
        </div>

        {/* 語法卡片網格 */}
        <div className="cheat-sheet-grid">
          {activeCategory.items.length === 0 ? (
            <div className="empty-placeholder" style={{gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--card-bg)', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)'}}>
              <Info size={32} style={{marginBottom: '1rem', color: 'var(--accent-primary)', opacity: 0.8}} />
              <h3 style={{fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem'}}>此單元尚無內容</h3>
              <p style={{fontSize: '0.9rem'}}>您可以編輯 <code>CheatSheet.jsx</code> 中的 <code>categories</code> 陣列來為此單元增添內容。</p>
            </div>
          ) : (
            activeCategory.items.map((item, idx) => {
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
            })
          )}
        </div>
      </main>
    </div>
  );
}
