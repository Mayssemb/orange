from sentence_transformers import SentenceTransformer, util

class SkillEmbedder:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def skill_match_score(self, candidate_skills, required_skills):
        if not candidate_skills or not required_skills:
            return 0.0, [], required_skills

        c_emb = self.model.encode(candidate_skills, convert_to_tensor=True)
        r_emb = self.model.encode(required_skills, convert_to_tensor=True)
        sim_matrix = util.cos_sim(c_emb, r_emb)

        matched, gaps = [], []
        for i, req_skill in enumerate(required_skills):
            best_score = sim_matrix[:, i].max().item()
            if best_score >= 0.60:
                matched.append(req_skill)
            else:
                gaps.append(req_skill)

        score = len(matched) / len(required_skills)
        return round(score, 4), matched, gaps

    def speciality_match_score(self, candidate_speciality: str, required_speciality: str) -> float:
        if not candidate_speciality or not required_speciality:
            return 0.0

        c_emb = self.model.encode(candidate_speciality, convert_to_tensor=True)
        r_emb = self.model.encode(required_speciality, convert_to_tensor=True)
        score = util.cos_sim(c_emb, r_emb).item()
        return round(max(score, 0.0), 4)