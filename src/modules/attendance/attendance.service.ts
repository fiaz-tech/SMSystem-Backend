import db from "../../config/db.config.js";
import type { RowDataPacket } from "mysql2";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";

//Teacher GET  students for attendance
export const getStudentsForSubjectAttendanceService = async (
    classId: number,
    subjectId: number
) => {

    const [rows] = await db.query(
        `
    SELECT u.id, u.username
    FROM student_subjects ss
    JOIN users u ON u.id = ss.student_id
    WHERE ss.class_id = ?
    AND ss.subject_id = ?
    AND ss.status IN ('accepted','compulsory')
    `,
        [classId, subjectId]
    );

    return rows;
};




//MARK Attentande
export const markAttendanceService = async (
    schoolId: number,
    teacherId: number,
    classId: number,
    subjectId: number,
    attendanceList: {
        studentId: number;
        status: 'present' | 'absent' | 'late';
    }[]
) => {

    //Check if teacher is assigned to the subject and teacher belongs to the school
    const [assignment]: any = await db.query(
        `
  SELECT id FROM subject_teachers
  WHERE teacher_id = ?
  AND subject_id = ?
  AND class_id = ?
  AND school_id = ?
  `,
        [teacherId, subjectId, classId, schoolId]
    );

    if (!assignment.length) {
        throw new ForbiddenError('You are not assigned to this subject for this class')
    }


    //Verify students belong to subject
    const studentIds = attendanceList.map(a => a.studentId);

    const [students]: any = await db.query(
        `
      SELECT student_id FROM student_subjects
      WHERE class_id = ?
      AND subject_id = ?
      AND school_id = ?
      AND student_id IN (?)
      AND status IN ('accepted','compulsory')
      `,
        [classId, subjectId, schoolId, studentIds]
    );

    if (students.length !== studentIds.length) {
        throw new NotFoundError('One or more students are not enrolled in this subject');
    }



    const values = attendanceList.map(record => [
        schoolId,
        teacherId,
        classId,
        subjectId,
        record.studentId,
        record.status
    ]);

    await db.query(
        `
    INSERT INTO attendance
    (school_id, teacher_id, class_id, subject_id, student_id, attendance_date, status)
    VALUES ?
    `,
        [values.map(v => [...v, new Date()])]
    );
};








