import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PfeService } from '../pfe/pfe.service';

@Injectable()
export class SeedService {
  constructor(
    private usersService: UsersService,
    private pfeService: PfeService,
  ) {}

  async seed() {
    // ================= USERS =================
    const usersMap = new Map<number, any>();

    const usersData = [
      { id: 1, name: 'meriem damak', email: 'meriem.damak@orange.tn', role: 'TEAM_LEAD', department: 'Réseaux & Télécoms' },
      {id:2, name: 'mayssem Boulajfene', email: 'mayssem.boulajfene@orange.tn', role: 'TEAM_LEAD', department: 'Intelligence Artificielle' },
      { id: 3, name: 'mahdi rebai', email: 'mahdi.rebai@orange.tn', role: 'TEAM_LEAD', department: 'Data Science & Analytics' },
      { id: 4, name: 'Karim Jaziri', email: 'karim.jaziri@orange.tn', role: 'TEAM_LEAD', department: 'Développement Web & Mobile' },
      { id: 5, name: 'Rania Khalfallah', email: 'rania.khalfallah@orange.tn', role: 'TEAM_LEAD', department: 'Cloud & Infrastructure' },
      { id: 6, name: 'Hatem Chaouch', email: 'hatem.chaouch@orange.tn', role: 'TEAM_LEAD', department: 'Cybersécurité' },
      { id: 7, name: 'Nour Ben Amor', email: 'nour.benamor@orange.tn', role: 'TEAM_LEAD', department: 'Expérience Client & IA' },
      { id: 8, name: 'Walid Haddad', email: 'walid.haddad@orange.tn', role: 'TEAM_LEAD', department: 'Marketing Digital' },
      { id: 9, name: 'Sonia Bouazizi', email: 'sonia.bouazizi@orange.tn', role: 'TEAM_LEAD', department: 'RH & Management' },
      { id: 10, name: 'Mehdi Karray', email: 'mehdi.karray@orange.tn', role: 'TEAM_LEAD', department: 'Innovation' },
      { id: 11, name: 'achref hacheni', email: 'achref.hacheni@orange.tn', role: 'HR', department: 'HR' },
    ];

    for (const u of usersData) {
      const user = await this.usersService.create({
        ...u,
        password: '0000',
      });
        console.log('Created user:', user); 
      if (user) {
      usersMap.set(u.id, user);
    }}

    // ================= PFE =================
    const pfeData = [
      {
        title: "Dashboard RH et analyse prédictive des talents",
        description: "Créer un tableau de bord RH interactif avec analyse prédictive.",
        duration: 3,
        number_of_interns: 1,
        technologies: ["Power BI", "Python", "SQL"],
        diploma: "Bac+3/5",
        status: "PENDING",
        direction: "Direction Ressources Humaines",
        teamLeadId: 9,
      },
      {
        title: "Automatisation de la gestion des incidents RAN",
        description: "Automatiser les incidents réseau RAN.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Python", "Ansible", "SNMP"],
        diploma: "Bac+5 Télécoms",
        status: "APPROVED",
        direction: "Direction Technique & Réseaux",
        teamLeadId: 1,
      },
      {
        title: "Système AIOps pour supervision réseau",
        description: "Détection intelligente des anomalies.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Python", "Machine Learning", "Docker"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Technique & Réseaux",
        teamLeadId: 2,
      },
      {
        title: "Dashboard de monitoring 5G et Backhaul",
        description: "Monitoring réseau 5G.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["React", "Grafana", "Prometheus"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Technique & Réseaux",
        teamLeadId: 1,
      },
      {
        title: "Plateforme de détection de spams",
        description: "Détection NLP des spams.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["NLP", "TensorFlow"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Data & IA",
        teamLeadId: 2,
      },
      {
        title: "Chatbot IA service client",
        description: "Chatbot basé sur LLM.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["LLM", "Python", "RAG"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Expérience Client",
        teamLeadId: 2,
      },
      {
        title: "Classification automatique des documents",
        description: "Deep learning + NLP.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Deep Learning", "OCR"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Data & IA",
        teamLeadId: 2,
      },
      {
        title: "Système de recommandation intelligent",
        description: "ML recommendation engine.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Python", "Spark"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Expérience Client",
        teamLeadId: 3,
      },
      {
        title: "Data Lake et pipeline",
        description: "Big data pipelines.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Hadoop", "Kafka"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Data",
        teamLeadId: 3,
      },
      {
        title: "Gouvernance des données",
        description: "Data quality framework.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["SQL", "Metadata"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Data",
        teamLeadId: 3,
      },
      {
        title: "Plateforme collaborative analytics",
        description: "Reporting web platform.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["React", "Node.js"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction SI",
        teamLeadId: 4,
      },
      {
        title: "Application mobile tickets",
        description: "Gestion tickets mobile.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["React Native", "Firebase"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction SI",
        teamLeadId: 4,
      },
      {
        title: "Migration cloud Kubernetes",
        description: "Cloud-native migration.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["Docker", "Kubernetes"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction SI",
        teamLeadId: 5,
      },
      {
        title: "SIEM logs sécurité",
        description: "Centralisation logs.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["ELK", "SIEM"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Direction Cybersécurité",
        teamLeadId: 6,
      },
      {
        title: "Solution IoT monitoring",
        description: "Monitoring IoT.",
        duration: 6,
        number_of_interns: 1,
        technologies: ["IoT", "MQTT"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Innovation",
        teamLeadId: 10,
      },
      {
        title: "Plateforme e-learning",
        description: "Gamified learning.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["React", "MongoDB"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "RH",
        teamLeadId: 9,
      },
      {
        title: "Scoring marketing",
        description: "Segmentation clients.",
        duration: 4,
        number_of_interns: 1,
        technologies: ["ML", "SQL"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Marketing",
        teamLeadId: 8,
      },
      {
        title: "Analyse parcours client",
        description: "Omnichannel analysis.",
        duration: 3,
        number_of_interns: 1,
        technologies: ["Google Analytics"],
        diploma: "Bac+5",
        status: "APPROVED",
        direction: "Marketing",
        teamLeadId: 8,
      }
    ];

  for (const p of pfeData) {
  const user = usersMap.get(p.teamLeadId);
  if (user) {
    await this.pfeService.create({
      ...p,
      teamLead: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    }, user.id); 
  }
}

    return { message: "✅ FULL database seeded" };
  }
}