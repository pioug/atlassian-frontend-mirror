import questions from '../../data/questions';
import results from '../../data/results';
import { Question, questionID, resultID } from '../../data/types';

describe('questions list', () => {
  it('should be a connected tree (all questions should be accessible from the root)', () => {
    const getAllChildQuestions = (node: Question): questionID[] => {
      var list: questionID[] = [];
      for (const answer of node.answers) {
        if (answer.next) {
          list.push(answer.next);
          list = list.concat(getAllChildQuestions(questions[answer.next]));
        }
      }
      return list;
    };

    const accessibleQuestions = ['root'].concat(
      getAllChildQuestions(questions['root']),
    );

    expect(accessibleQuestions.sort()).toEqual(Object.keys(questions).sort());
  });

  it('should link to every result', () => {
    const getAllResults = (node: Question): resultID[] => {
      var list: resultID[] = [];
      for (const answer of node.answers) {
        if (answer.next) {
          list = list.concat(getAllResults(questions[answer.next]));
        } else {
          const recommendations = answer.result;
          list = list.concat(recommendations);
        }
      }
      return list;
    };

    const allResults = getAllResults(questions['root']);

    // In case an answer is referenced from multiple questions
    const dedupeAllResults = [...new Set(allResults)];

    expect(dedupeAllResults.sort()).toEqual(Object.keys(results).sort());
  });
});
