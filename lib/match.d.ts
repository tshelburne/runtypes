import { RuntypeBase } from './runtype';
import { Case, Matcher } from './types/union';
export declare function match<A extends [PairCase<any, any>, ...PairCase<any, any>[]]>(...cases: A): Matcher<{
    [key in keyof A]: A[key] extends PairCase<infer RT, any> ? RT : unknown;
}, {
    [key in keyof A]: A[key] extends PairCase<any, infer Z> ? Z : unknown;
}>;
export declare type PairCase<A extends RuntypeBase, Z> = [A, Case<A, Z>];
