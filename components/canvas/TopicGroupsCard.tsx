import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';

interface TopicGroup {
  group: string;
  topic: string;
  description: string;
}

interface TopicGroupsCardProps {
  groups: TopicGroup[];
}

const TopicGroupsCard: React.FC<TopicGroupsCardProps> = ({ groups }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {groups?.map((group, index) => (
        <Card key={index} className="p-4 border rounded-md shadow-md bg-black text-gray-200">
          <CardHeader>
            <h4 className="text-xl font-bold">{group.group}</h4>
          </CardHeader>
          <div className='flex flex-col gap-3'>
            <p><strong>Topic/Theme:</strong> {group.topic}</p>
            <p>{group.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TopicGroupsCard;
