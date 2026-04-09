-- Drop the vulnerable UPDATE policy that allows users to self-escalate their subscription
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

-- Also drop the INSERT policy - subscriptions should only be managed server-side
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;