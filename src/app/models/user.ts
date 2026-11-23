export interface Features {
    conferenceCalling: boolean;
    callWaiting: boolean;
    voicemail: boolean;
}

export interface Plan {
    type: string;
    status: 'active' | 'inactive';
    description: string;
    features: Features;
}

export interface User {
    id: string;
    name: string;
    email: string;
    age: number;
    plan: Plan;
    dataWarnings?: string[]
}