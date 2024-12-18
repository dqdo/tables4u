Context:
• Allow restaurant manager to create a restaurant with the platform
• Restaurant managers can construct daily schedule of potential tables to be reserved at specific times
• Administrator can review availability at any restaurant in system
• Consumers can search for available tables by date and time, and reserve a table (or cancel a future reservation).

Group Project: Tables4u

Administrators [authorized]
• List restaurants and their available & reserved tables (within date range) and include percentage of utilization. Dates can be in the past
• Can list all active and inactive restaurants
• Delete restaurant
• Cancel any specific reservation

Restaurant Manager [authorized]
• Create a restaurant (with credentials for secure access)
• Design daily schedule of available tables and times
• Activate a restaurant so consumers can reserve tables. Once activated, restaurant cannot be deactivated
• Delete restaurant
• Show current day’s availability for all tables/times

Consumers [anyone]
• Search all restaurants in system to find which ones have available table at specific future day and time
• Search specific restaurant to see availability for specific day
• Reserve specific table at specific restaurant at specific day and time

Restaurant (has a name and street address)
• A restaurant has specific number of tables, N
• Each table for the restaurant has a unique number [1..N] and a fixed number of seats (from 1 to 8)
• A table is reserved for 1 hour exactly
• A restaurant opens at a specific hour (like 17:00 which is 5PM)
• That is the first time that any table can be reserved
• A restaurant closes at a specific hour (like 23:00 which is 11PM)
• The last time that any table can be reserved is one hour before closing hour
• Each restaurant can have specific days on which it is closed
• The restaurant manager can change these closing days as long as they refer to future days
• They can specify future day when restaurant is closed (but not for current or past day)
• They can remove a future closing day so it becomes open once again (but not for current or past day)
• Each restaurant has a daily schedule that can be updated while the restaurant is “inactive”
• Restaurant owner can adjust starting or ending times, number of tables, and even number of seats at specific table
• Once the restaurant becomes “active” daily schedule cannot be edited
• Consumers can make reservations on given days and times at an active restaurant

Consumers
• A consumer can list all available (active) restaurants in system
• For a specific day, a consumer can see which restaurants have an available table for a given time (day and time must be in future)
• Can reserve a single table at a specific restaurant on a future day and time
• Cannot reserve tables for any time in the past
• Consumer must provide a valid email address
• Once reserved, consumer is given a confirmation code (a six-digit number)
• Can find an existing reservation using email and confirmation code
• Cancelations
• Can cancel an existing reservation using email and confirmation code
• A consumer can cancel a reservation at least one calendar day in advance
• If it is now 11PM on October 29th, the consumer could cancel a reservation for 10AM on October 30th
• If it is now 8AM on October 30th, the consumer cannot cancel a reservation for 10AM on October 30th since that is on the same day
