import React, { useState, useEffect } from 'react';
import { PaymentService } from '../services/PaymentService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { supabase } from '../lib/supabase';

interface VoteManagementProps {
  eventId: string;
  contestantId: string;
  votePrice: number;
}

export const VoteManagement: React.FC<VoteManagementProps> = ({
  eventId,
  contestantId,
  votePrice
}) => {
  const [voteCount, setVoteCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const paymentService = new PaymentService();

  // Real-time vote count subscription
  useEffect(() => {
    const voteSubscription = supabase
      .from('votes')
      .on('INSERT', payload => {
        if (payload.new.contestant_id === contestantId) {
          setVoteCount(current => current + payload.new.vote_count);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(voteSubscription);
    };
  }, [contestantId]);

  const handleVote = async (numberOfVotes: number) => {
    try {
      const reference = `vote_${eventId}_${contestantId}_${Date.now()}`;
      const transaction = await paymentService.processPayment({
        email: user.email,
        amount: votePrice * numberOfVotes,
        reference,
        metadata: {
          type: 'vote',
          eventId,
          contestantId,
          numberOfVotes
        }
      });

      // Record vote after successful payment
      await supabase.from('votes').insert({
        event_id: eventId,
        contestant_id: contestantId,
        user_id: user.id,
        vote_count: numberOfVotes,
        payment_reference: reference
      });

      toast({
        title: "Vote Successful",
        description: `You have successfully voted ${numberOfVotes} times!`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Vote Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Current Votes: {voteCount}
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => handleVote(1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Vote Once (₦{votePrice})
        </button>
        <button
          onClick={() => handleVote(5)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Vote 5 Times (₦{votePrice * 5})
        </button>
      </div>
    </div>
  );
};