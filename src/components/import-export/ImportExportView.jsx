import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Download, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { exportToIcs, importFromIcs } from '../../services/api';

export default function ImportExportView({ accessToken, onImportSuccess }) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      await exportToIcs(accessToken);
      // 성공 메시지는 파일 다운로드로 대체
    } catch (err) {
      setError('Export 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // .ics 파일인지 확인
    if (!file.name.endsWith('.ics')) {
      setError('.ics 파일만 업로드할 수 있습니다.');
      return;
    }

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const result = await importFromIcs(file, accessToken);
      setImportResult(result);

      // 성공 시 태스크 목록 새로고침
      if (result.imported > 0) {
        onImportSuccess?.();
      }
    } catch (err) {
      setError('Import 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setImporting(false);
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Import / Export</h1>
          <p className="text-muted-foreground">
            .ics 파일로 태스크를 가져오거나 내보낼 수 있습니다
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Import 완료!
                </p>
                <div className="text-xs text-green-700 space-y-1">
                  <p>• 성공: {importResult.imported}개</p>
                  <p>• 실패: {importResult.failed}개</p>
                  <p>• 전체: {importResult.total}개</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Card */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Export</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              모든 태스크를 .ics 파일로 내보냅니다. Google Calendar, Apple Calendar 등에서
              사용할 수 있습니다.
            </p>

            <Button
              onClick={handleExport}
              disabled={exporting}
              className="w-full"
            >
              {exporting ? (
                <>내보내는 중...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export to .ics
                </>
              )}
            </Button>
          </div>

          {/* Import Card */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Import</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              .ics 파일에서 태스크를 가져옵니다. VTODO와 VEVENT 형식을 지원합니다.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".ics"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              onClick={handleImportClick}
              disabled={importing}
              variant="outline"
              className="w-full"
            >
              {importing ? (
                <>가져오는 중...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import from .ics
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                지원 형식
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>VTODO</strong>: 할 일 항목</li>
                <li>• <strong>VEVENT</strong>: 일정 (종료 시간이 마감일로 변환됨)</li>
              </ul>

              <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">
                사용 예시
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Google Calendar에서 일정을 내보내서 태스크로 가져오기</li>
                <li>• 다른 기기 또는 사용자와 태스크 공유</li>
                <li>• 백업 및 복원</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
