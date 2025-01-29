import icalendar
from pathlib import Path
import recurring_ical_events


ics_path = Path("./calendarTestFiles/gt-scheduler.ics")
with ics_path.open() as f:
    calendar = icalendar.Calendar.from_ical(f.read())

start_date = (2024, 1, 1)
end_date = (2026, 1, 1)

events = recurring_ical_events.of(calendar).between(start_date, end_date)

for event in events:
    start = event["DTSTART"].dt
    summary = event["SUMMARY"]
    print(f"Start: {start} Summary: {summary}")

for event in calendar.walk('VEVENT'):
    print(event.get("SUMMARY"))
    print(event.get("LOCATION"))
    print(event.decoded("DTSTART"))
    print(event.decoded("DTEND"))
