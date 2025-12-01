import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class ContentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ length: 100, unique: true })
    title: string;

    @Column('text')
    coverUrl: string;

    @Column({ length: 100, unique: true })
    slug: string;

    @Column('int')
    segmentId: number

    @Column('int')
    topicId: number
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}