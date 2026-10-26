# TRL assessment

**TRL 4.** Component behavior was checked in a developer environment: a unit test of the upload-panel motion decision, plus the local React upload card that calls it. That is laboratory validation of a piece of the interface. It is not validation in a relevant environment.

This is not TRL 5 or higher. No user study was run. The app was not deployed. Nothing in this change is a certification. The upload screen was not opened in a browser for this assessment.

The PDF extraction fix (reading every page, and keeping later text chunks) is covered by `tests/test_ingest.py`. Those are local unit tests. They do not raise this product above TRL 4.
