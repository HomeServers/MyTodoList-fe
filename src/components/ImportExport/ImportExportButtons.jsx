import { useState, useRef } from 'react';
import { exportToIcs, importFromIcs } from '../../services/api';
import './ImportExportButtons.css';

/**
 * Import/Export 버튼 컴포넌트
 * .ics 파일 다운로드 및 업로드 기능 제공
 */
export const ImportExportButtons = ({ accessToken, onImportSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Export 버튼 클릭
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setMessage('');
      await exportToIcs(accessToken);
      setMessage('Export 성공!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Export 실패: ${error.message}`);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Import 버튼 클릭
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // .ics 파일 확인
    if (!file.name.endsWith('.ics')) {
      setMessage('Error: .ics 파일만 업로드 가능합니다.');
      return;
    }

    try {
      setIsImporting(true);
      setMessage('Import 중...');

      const result = await importFromIcs(file, accessToken);

      setMessage(`Import 완료: 성공 ${result.imported}개, 실패 ${result.failed}개`);

      // Import 성공 시 콜백 호출 (태스크 목록 갱신)
      if (onImportSuccess) {
        onImportSuccess();
      }

      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`Import 실패: ${error.message}`);
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
      // 파일 input 초기화 (같은 파일 다시 선택 가능하도록)
      event.target.value = '';
    }
  };

  return (
    <div className="import-export-container">
      <div className="import-export-buttons">
        <button
          className="export-button"
          onClick={handleExport}
          disabled={isExporting}
          title="할 일을 .ics 파일로 내보내기 (VTODO 형식)"
        >
          {isExporting ? 'Exporting...' : '📤 Export'}
        </button>

        <button
          className="import-button"
          onClick={handleImportClick}
          disabled={isImporting}
          title="Google Calendar 등에서 내보낸 .ics 파일 가져오기 (VTODO 및 VEVENT 지원)"
        >
          {isImporting ? 'Importing...' : '📥 Import'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".ics"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {message && (
        <div className={`import-export-message ${message.includes('실패') || message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="import-export-info">
        💡 VTODO(할 일)와 VEVENT(일정) 모두 가져올 수 있습니다. 일정의 종료 시간이 만료 기한으로 설정됩니다.
      </div>
    </div>
  );
};
