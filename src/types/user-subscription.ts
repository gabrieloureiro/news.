import { NewsUser, NewsChannel } from ".";

export type UserSubscription = {
  Id: string;
  User__c: NewsUser;
  Channel__c: NewsChannel;
};
