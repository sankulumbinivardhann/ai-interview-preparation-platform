import { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  generateResumePdf,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an Interview Provider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  const getReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports || []);
      return response.interviewReports || [];
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  const getReportById = useCallback(
    async (nextInterviewId) => {
      setLoading(true);
      try {
        const response = await getInterviewReportById(nextInterviewId);
        setReport(response.interviewReport ?? null);
        return response.interviewReport ?? null;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport]
  );

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setLoading(true);
      try {
        const response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        });
        const nextReport = response.interviewReport ?? null;
        setReport(nextReport);
        return nextReport;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport]
  );

  const getResumePdf = useCallback(
    async (interviewReportId) => {
      setLoading(true);
      try {
        const response = await generateResumePdf({ interviewReportId });
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `resume_${interviewReportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return response;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
      return;
    }

    getReports();
  }, [getReportById, getReports, interviewId]);

  return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
};