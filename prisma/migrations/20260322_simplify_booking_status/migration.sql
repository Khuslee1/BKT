-- Step 1: Drop the column default (it references the old enum type)
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;

-- Step 2: Convert column to text so values can be freely changed
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE text;

-- Step 3: Remap old statuses to new simplified values
UPDATE "Booking" SET status = 'pending'  WHERE status IN ('confirmed', 'deposit_paid');
UPDATE "Booking" SET status = 'paid'     WHERE status = 'fully_paid';
UPDATE "Booking" SET status = 'rejected' WHERE status = 'cancelled';

-- Step 4: Drop the old enum (no dependents now)
DROP TYPE "BookingStatus";

-- Step 5: Create simplified enum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'rejected', 'paid');

-- Step 6: Convert column back to the new enum and restore default
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus" USING status::"BookingStatus";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'pending'::"BookingStatus";
