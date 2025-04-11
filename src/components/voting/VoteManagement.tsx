import * as React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { usePayment } from "../../hooks/usePayment";
import { supabase } from "../../lib/supabase";
import { Button, type ButtonVariants } from "../ui/button";
import type { RealtimePayload } from "../../types/supabase";

interface VoteManagementProps {
  eventId: string;
  contestantId: string;
  votePrice: number;
  variant?: ButtonVariants["variant"];
}

type VoteData = {
  contestant_id: string;
  vote_count: number;
};

export const VoteManagement = ({
  eventId,
  contestantId,
  votePrice,
  variant = "default",
}: VoteManagementProps) => {
  const [voteCount, setVoteCount] = React.useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { processing, handlePayment } = usePayment();

  React.useEffect(() => {
    const subscription = supabase
      .channel("votes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `contestant_id=eq.${contestantId}`,
        },
        (payload: RealtimePayload<VoteData>) => {
          setVoteCount((current) => current + (payload.new?.vote_count ?? 0));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, [contestantId]);

  const handleVote = async (numberOfVotes: number) => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      await handlePayment({
        email: user.email,
        amount: votePrice * numberOfVotes,
        metadata: {
          type: "vote",
          eventId,
          contestantId,
          numberOfVotes,
        },
      });

      const { error: dbError } = await supabase.from("votes").insert({
        event_id: eventId,
        contestant_id: contestantId,
        user_id: user.id,
        vote_count: numberOfVotes,
        payment_reference: `vote_${eventId}_${contestantId}_${Date.now()}`,
      });

      if (dbError) throw dbError;

      toast({
        title: "Vote Successful",
        description: `You have successfully voted ${numberOfVotes} times!`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description:
          error instanceof Error ? error.message : "Failed to process vote",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Current Votes: {voteCount}</div>
      <div className="flex gap-4">
        <Button
          onClick={() => handleVote(1)}
          disabled={processing}
          variant={variant}
        >
          Vote Once (₦{votePrice.toLocaleString()})
        </Button>
        <Button
          onClick={() => handleVote(5)}
          disabled={processing}
          variant="secondary"
        >
          Vote 5 Times (₦{(votePrice * 5).toLocaleString()})
        </Button>
      </div>
    </div>
  );
};
