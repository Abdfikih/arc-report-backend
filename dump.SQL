SELECT arc_swift.equipment, arc_swift.material_number, arc_swift.serial_number, arc_swift.material_description, arc_swift.material_group, arc_swift.aircraft_reg, docfile.doc_no, location.doc_box, location.doc_locations
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no
LEFT JOIN location ON docfile.doc_location = location.doc_box;

-----------------------------------------------
CREATE VIEW view_get_data AS
SELECT *
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no
LEFT JOIN location ON docfile.doc_location = location.doc_box;

-----------------------------------------------
CREATE VIEW view_count_data AS
SELECT COUNT(*) AS total_rows
FROM view_get_data;

-----------------------------------------------
CREATE VIEW view_get_data_time AS
SELECT arc_swift.aircraft_reg, arc_swift.ac_type, arc_swift.operator, arc_swift.material_group, arc_swift.title, docfile.doc_createddate, docfile.doc_posting_date, docfile.doc_no
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no

-------------------------------------------------

select * from view_get_data_time 
        WHERE doc_posting_date IS NOT NULL
        ORDER BY doc_posting_date DESC;

        SELECT
          aircraft_reg,
          COUNT(*) as total_count
        FROM view_get_data_time
        WHERE doc_posting_date IS NOT NULL
        GROUP BY aircraft_reg;

        SELECT
          aircraft_reg,
          COUNT(*) as total_count
        FROM view_get_data_time
        WHERE doc_posting_date IS NOT NULL
          AND DATE_PART('05', doc_posting_date)
          AND DATE_PART('2023', doc_posting_date)
        GROUP BY aircraft_reg;
      
        SELECT
          aircraft_reg,
          COUNT(*) as total_count
        FROM view_get_data_time
        GROUP BY aircraft_reg;

        SELECT
          aircraft_reg,
          material_group,
          COUNT(*) as total_count
        FROM view_get_data_time
        GROUP BY aircraft_reg, material_group;

        SELECT
          aircraft_reg,
          material_group,
          COUNT(*) as total_count,
          COUNT(*) OVER (PARTITION BY aircraft_reg) as total_count_aircraft
        FROM view_get_data_time
        GROUP BY aircraft_reg, material_group;

        SELECT
          aircraft_reg,
          COUNT(*) as total_count,
          SUM(CASE WHEN material_group LIKE 'LLP%' AND doc_no IS NOT NULL THEN 1 ELSE 0 END) as "LPP-Linked",
          SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "LPP-Baseline",
          SUM(CASE WHEN material_group LIKE 'TC%' AND doc_no IS NOT NULL THEN 1 ELSE 0 END) as "TC-Linked",
          SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "TC-Baseline",
          SUM(CASE WHEN material_group LIKE 'NON%' AND doc_no IS NOT NULL THEN 1 ELSE 0 END) as "NON TC-Linked",
          SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "NON TC-Baseline",
          SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "OTHER"
        FROM view_get_data_time
        GROUP BY aircraft_reg;

CREATE VIEW view_get_data_time_result AS
SELECT
  ROW_NUMBER() OVER () as "id",
  aircraft_reg,
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_time
GROUP BY aircraft_reg, operator, ac_type;
-----------------------------------------------------------------------------
CREATE VIEW view_get_data_time_total AS
SELECT
  ROW_NUMBER() OVER () as "id",
  ac_type,
  operator,
  SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "llp_linked",
  SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) as "llp_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'LLP%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'LLP%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "llp_percentage",
  SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "tc_linked",
  SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) as "tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'TC%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'TC%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "tc_percentage",
  SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) as "non_tc_linked",
  SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) as "non_tc_baseline",
  ROUND(
    CAST(SUM(CASE WHEN material_group LIKE 'NON%' AND (doc_no IS NOT NULL OR title IS NOT NULL) THEN 1 ELSE 0 END) AS DECIMAL(10,2)) /
    NULLIF(CAST(SUM(CASE WHEN material_group LIKE 'NON%' THEN 1 ELSE 0 END) AS DECIMAL(10,2)), 0) * 100,
    2
  ) as "non_tc_percentage",
  SUM(CASE WHEN material_group IS NULL THEN 1 ELSE 0 END) as "other",
  COUNT(*) as total_count
FROM view_get_data_time
GROUP BY operator, ac_type;
------------------------------------------------------------------------------
CREATE VIEW view_data_status AS
SELECT
  formatted_month,
  total_available,
  total_unavailable,
  total_available + total_unavailable AS total_documents
FROM (
  SELECT
    TO_CHAR(CAST(doc_posting_date AS DATE), 'YYYY-MM') AS formatted_month,
    COUNT(CASE WHEN doc_box IS NOT NULL THEN 1 END) AS total_available,
    COUNT(CASE WHEN doc_box IS NULL THEN 1 END) AS total_unavailable
  FROM arc_swift
  LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                     OR arc_swift.batch_notif_w4 = docfile.doc_no
                     OR arc_swift.po_number = docfile.doc_no
  LEFT JOIN location ON docfile.doc_location = location.doc_box
  WHERE docfile.doc_posting_date IS NOT NULL AND docfile.doc_posting_date ~ '^\d{4}-\d{2}-\d{2}$'
  GROUP BY TO_CHAR(CAST(docfile.doc_posting_date AS DATE), 'YYYY-MM')
) AS subquery
ORDER BY formatted_month;

----------------------------------------------------
CREATE VIEW view_data_null_available AS
SELECT
  COUNT(CASE WHEN doc_posting_date IS NULL OR doc_posting_date !~ E'^\\d{4}-\\d{2}-\\d{2}$' THEN 1 END) AS total_null
FROM arc_swift
LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                   OR arc_swift.batch_notif_w4 = docfile.doc_no
                   OR arc_swift.po_number = docfile.doc_no
LEFT JOIN location ON docfile.doc_location = location.doc_box;

----------------------------------------------------
CREATE VIEW view_count_status_general AS
  SELECT
    COUNT (*) AS total_count,
    COUNT(CASE WHEN doc_box IS NOT NULL OR title IS NOT NULL THEN 1 END) AS total_available,
    COUNT(CASE WHEN doc_box IS NULL AND title IS NULL THEN 1 END) AS total_unavailable
  FROM arc_swift
  LEFT JOIN docfile ON arc_swift.order_notif_w3 = docfile.doc_no
                     OR arc_swift.batch_notif_w4 = docfile.doc_no
                     OR arc_swift.po_number = docfile.doc_no
  LEFT JOIN location ON docfile.doc_location = location.doc_box;

  -----------------------------------------------------
  SELECT
    arc_swift.equipment,
    arc_swift.material_number,
    arc_swift.serial_number,
    arc_swift.material_description,
    arc_swift.material_group,
    arc_swift.aircraft_reg,
    docfile.doc_no,
    location.doc_box,
    location.doc_locations
FROM
    arc_swift
LEFT JOIN
    docfile
ON
    arc_swift.order_notif_w3 = docfile.doc_no
    OR arc_swift.batch_notif_w4 = docfile.doc_no
    OR arc_swift.po_number = docfile.doc_no
LEFT JOIN
    location
ON
    docfile.doc_location = location.doc_box
WHERE
    arc_swift.material_description LIKE '%PK%'
    OR arc_swift.aircraft_reg LIKE '%PK%'
    OR docfile.doc_no LIKE '%PK%';


SELECT DISTINCT aircraft_reg FROM arc_swift;
